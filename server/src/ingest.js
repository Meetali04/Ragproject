import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const knowledgeDirectory = path.join(currentDirectory, 'knowledge')
const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
const batchSize = 50

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY
const openaiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  throw new Error('Set SUPABASE_URL, SUPABASE_SECRET_KEY, and OPENAI_API_KEY in server/.env before ingesting knowledge.')
}

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return findMarkdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : []
  }))

  return nestedFiles.flat()
}

function chunkMarkdown(markdown, maxCharacters = 1200) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  const chunks = []
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxCharacters) {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = ''
      for (let offset = 0; offset < paragraph.length; offset += maxCharacters) {
        chunks.push(paragraph.slice(offset, offset + maxCharacters))
      }
      continue
    }

    const combined = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph
    if (combined.length > maxCharacters) {
      chunks.push(currentChunk)
      currentChunk = paragraph
    } else {
      currentChunk = combined
    }
  }

  if (currentChunk) chunks.push(currentChunk)
  return chunks
}

async function ingestFile(filePath) {
  const markdown = await readFile(filePath, 'utf8')
  const relativeSource = path.relative(knowledgeDirectory, filePath)
  const chunks = chunkMarkdown(markdown)

  for (let offset = 0; offset < chunks.length; offset += batchSize) {
    const chunkBatch = chunks.slice(offset, offset + batchSize)
    const embeddingResponse = await openai.embeddings.create({
      model: embeddingModel,
      input: chunkBatch,
    })

    const rows = chunkBatch.map((content, index) => ({
      content,
      metadata: {
        source: relativeSource,
        chunk_index: offset + index,
      },
      embedding: embeddingResponse.data[index].embedding,
    }))

    const { error } = await supabase.from('documents').insert(rows)
    if (error) throw new Error(`Supabase insert failed for ${relativeSource}: ${error.message}`)
  }

  console.log(`Ingested ${chunks.length} chunks from ${relativeSource}`)
}

const markdownFiles = await findMarkdownFiles(knowledgeDirectory)
if (markdownFiles.length === 0) {
  console.log(`No Markdown files found in ${knowledgeDirectory}`)
} else {
  for (const filePath of markdownFiles) await ingestFile(filePath)
}