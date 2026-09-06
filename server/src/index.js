import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

const destinations = [
  { id: 1, name: 'Amalfi Coast', region: 'Mediterranean', country: 'Italy', budget: 'Premium', duration: 7, type: 'Coastal', description: 'Cliffside villages and lemon-scented mornings.', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Kyoto', region: 'East Asia', country: 'Japan', budget: 'Mid-range', duration: 5, type: 'Culture', description: 'Quiet gardens, warm lantern light, and old tea houses.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Marrakech', region: 'North Africa', country: 'Morocco', budget: 'Budget', duration: 4, type: 'Culture', description: 'Rose-colored walls and markets full of stories.', image: 'https://images.unsplash.com/photo-1548013146-72479768badaa?auto=format&fit=crop&w=900&q=80' },
]

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'Connected to Node.js' })
})

app.get('/api/destinations', (_request, response) => {
  response.json(destinations)
})

app.get('/api/explore/options', (_request, response) => {
  response.json({
    regions: [...new Set(destinations.map((destination) => destination.region))],
    budgets: [...new Set(destinations.map((destination) => destination.budget))],
    types: [...new Set(destinations.map((destination) => destination.type))],
    durations: ['1-4 days', '5-7 days', '8+ days'],
    sorts: ['Recommended', 'Name A-Z', 'Shortest trips'],
  })
})

app.get('/api/destinations/search', (request, response) => {
  const { q = '', region, budget, duration, type, sort = 'Recommended' } = request.query
  const search = q.trim().toLowerCase()

  const results = destinations
    .filter((destination) => !search || destination.name.toLowerCase().includes(search) || destination.country.toLowerCase().includes(search))
    .filter((destination) => !region || destination.region === region)
    .filter((destination) => !budget || destination.budget === budget)
    .filter((destination) => !type || destination.type === type)
    .filter((destination) => {
      if (!duration) return true
      if (duration === '1-4 days') return destination.duration <= 4
      if (duration === '5-7 days') return destination.duration >= 5 && destination.duration <= 7
      return destination.duration >= 8
    })
    .sort((first, second) => {
      if (sort === 'Name A-Z') return first.name.localeCompare(second.name)
      if (sort === 'Shortest trips') return first.duration - second.duration
      return second.id - first.id
    })

  response.json({ count: results.length, destinations: results })
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