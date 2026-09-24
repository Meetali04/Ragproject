import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

const destinations = [
  { id: 1, name: 'Amalfi Coast', region: 'Mediterranean', country: 'Italy', budget: 'Premium', duration: 7, type: 'Coastal', description: 'Cliffside villages and lemon-scented mornings.', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Kyoto', region: 'East Asia', country: 'Japan', budget: 'Mid-range', duration: 5, type: 'Culture', description: 'Quiet gardens, warm lantern light, and old tea houses.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Marrakech', region: 'North Africa', country: 'Morocco', budget: 'Budget', duration: 4, type: 'Culture', description: 'Rose-colored walls and markets full of stories.', image: 'https://images.unsplash.com/photo-1548013146-72479768badaa?auto=format&fit=crop&w=900&q=80' },
]

const trips = [
  {
    id: 1,
    country: 'Japan',
    destination: 'Kyoto',
    days: 5,
    dates: '12 - 17 October 2026',
    status: 'Upcoming',
    description: 'A slow, thoughtful week of gardens, tea houses, and lantern-lit evenings.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    itinerary: [
      { day: 1, title: 'Arrival in Kyoto', plan: 'Settle into Gion and take an evening walk through the old streets.' },
      { day: 2, title: 'Temples and tea', plan: 'Visit Kiyomizu-dera, explore Higashiyama, and join a tea ceremony.' },
      { day: 3, title: 'Arashiyama', plan: 'Walk through the bamboo grove, visit the river, and enjoy a quiet garden lunch.' },
      { day: 4, title: 'Markets and makers', plan: 'Taste your way through Nishiki Market and meet local craftspeople.' },
      { day: 5, title: 'A gentle goodbye', plan: 'Enjoy a final morning in a garden cafe before departing.' },
    ],
  },
  {
    id: 2,
    country: 'Italy',
    destination: 'Amalfi Coast',
    days: 7,
    dates: '4 - 11 June 2027',
    status: 'Planning',
    description: 'Cliffside villages, lemon-scented mornings, and blue water all the way to Capri.',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200&q=80',
    itinerary: [
      { day: 1, title: 'Arrive in Positano', plan: 'Check in, settle by the sea, and watch the sunset from the terrace.' },
      { day: 2, title: 'Path of the Gods', plan: 'Hike the coastal trail with a local guide and picnic above the cliffs.' },
      { day: 3, title: 'Ravello gardens', plan: 'Explore Villa Cimbrone and enjoy a long lunch in the hills.' },
    ],
  },
]

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'Connected to Node.js' })
})

app.post('/api/ai-planner/chat', (request, response) => {
  const { answer = '', messageCount = 1 } = request.body
  const questions = [
    'When would you like to travel, and how many days do you have?',
    'What kind of pace and experiences do you prefer: relaxed, adventurous, cultural, or a mix?',
    'Perfect. I have enough to start shaping your personalized itinerary.',
  ]
  const questionIndex = Math.min(Math.max(messageCount - 1, 0), questions.length - 1)
  response.json({ message: answer.trim() ? questions[questionIndex] : 'Tell me a little more about your trip.' })
})

app.get('/api/destinations', (_request, response) => {
  response.json(destinations)
})

app.get('/api/trips', (_request, response) => {
  response.json(trips)
})

app.get('/api/trips/:id', (request, response) => {
  const trip = trips.find((item) => String(item.id) === request.params.id)
  if (!trip) return response.status(404).json({ message: 'Trip not found.' })
  response.json(trip)
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