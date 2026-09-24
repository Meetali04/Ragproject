import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

const firstMessage = {
  role: 'assistant',
  text: 'Where are you going?',
}

function PlannerHeader() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}>
        <Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif', letterSpacing: '-.06em' }}>
          roam<span style={{ color: '#e9825d' }}>.</span>
        </Link>
        <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Link href="/explore" color="inherit" underline="none">Explore</Link>
          <Link href="/ai-planner" color="inherit" underline="none">AI Planner</Link>
          <Link href="/trips" color="inherit" underline="none">My Trips</Link>
        </Stack>
        <Button variant="outlined" color="inherit" sx={{ borderRadius: 99 }}>Sign in</Button>
      </Toolbar>
    </AppBar>
  )
}

export function AIPlannerPage() {
  const [messages, setMessages] = useState([firstMessage])
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendAnswer(event) {
    event.preventDefault()
    const trimmedAnswer = answer.trim()
    if (!trimmedAnswer || loading) return

    setMessages((current) => [...current, { role: 'user', text: trimmedAnswer }])
    setAnswer('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai-planner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: trimmedAnswer, messageCount: messages.length }),
      })
      const result = await response.json()
      setMessages((current) => [...current, { role: 'assistant', text: result.message }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'I could not connect right now. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PlannerHeader />
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Your personal travel co-pilot</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '3.8rem', md: '7rem' }, lineHeight: .88, mt: 1 }}>Plan your trip<br /><Box component="em" sx={{ color: 'secondary.main' }}>with AI.</Box></Typography>
        <Typography sx={{ maxWidth: 500, mt: 3, color: 'text.secondary', fontSize: '1.1rem' }}>Tell me what you are imagining. I will help shape it into a trip that feels like yours.</Typography>
        <Paper elevation={0} sx={{ maxWidth: 760, mt: 6, p: { xs: 2, md: 4 }, bgcolor: '#fffaf0', border: '1px solid #d8d8cc' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 2, borderBottom: '1px solid #d8d8cc' }}>
            <Typography fontWeight={700}>roam AI planner</Typography>
            <Typography variant="caption" color="text.secondary">Online now</Typography>
          </Stack>
          <Stack spacing={2} sx={{ py: 3, minHeight: 280 }}>
            {messages.map((message, index) => <Box key={`${message.role}-${index}`} sx={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: { xs: '92%', sm: '75%' }, p: 2, bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper', color: message.role === 'user' ? '#fffaf0' : 'text.primary' }}><Typography>{message.text}</Typography></Box>)}
            {loading && <Typography variant="body2" color="text.secondary">AI is thinking...</Typography>}
          </Stack>
          <Box component="form" onSubmit={sendAnswer} sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer..." disabled={loading} inputProps={{ 'aria-label': 'Your answer' }} />
            <Button type="submit" variant="contained" color="secondary" disabled={loading || !answer.trim()}>Send</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
