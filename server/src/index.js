import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

const destinations = [
  { id: 1, name: 'Amalfi Coast', region: 'Italy / Mediterranean', description: 'Cliffside villages and lemon-scented mornings.', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Kyoto', region: 'Japan / East Asia', description: 'Quiet gardens, warm lantern light, and old tea houses.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Marrakech', region: 'Morocco / North Africa', description: 'Rose-colored walls and markets full of stories.', image: 'https://images.unsplash.com/photo-1548013146-72479768badaa?auto=format&fit=crop&w=900&q=80' },
]

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'Connected to Node.js' })
})

app.get('/api/destinations', (_request, response) => {
  response.json(destinations)
})

app.post('/api/bookings', (request, response) => {
  const { destination, travelers } = request.body
  if (!destination || !travelers) {
    return response.status(400).json({ message: 'Destination and travelers are required.' })
  }
  response.status(201).json({ message: `Great choice. We will help you plan ${destination} for ${travelers}.` })
})

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})