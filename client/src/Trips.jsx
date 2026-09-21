import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

function TripsHeader() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}>
        <Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif', letterSpacing: '-.06em' }}>
          roam<span style={{ color: '#e9825d' }}>.</span>
        </Link>
        <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Link href="/explore" color="inherit" underline="none">Explore</Link>
          <Link href="/#ai-planner" color="inherit" underline="none">AI Planner</Link>
          <Link href="/trips" color="inherit" underline="none">My Trips</Link>
        </Stack>
        <Button variant="outlined" color="inherit" sx={{ borderRadius: 99 }}>Sign in</Button>
      </Toolbar>
    </AppBar>
  )
}

function TripCard({ trip }) {
  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
      <CardMedia component="img" image={trip.image} alt={trip.destination} sx={{ width: { xs: '100%', md: 260 }, height: { xs: 220, md: 'auto' }, minHeight: 220, objectFit: 'cover' }} />
      <CardContent sx={{ flex: 1, p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="start" gap={2}>
          <Box>
            <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.12em' }}>{trip.country}</Typography>
            <Typography variant="h4" fontFamily="Georgia, serif">{trip.destination}</Typography>
          </Box>
          <Chip label={trip.status} color={trip.status === 'Upcoming' ? 'secondary' : 'default'} size="small" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 4 }} sx={{ mt: 3 }}>
          <Box><Typography variant="caption" color="text.secondary">Duration</Typography><Typography fontWeight={700}>{trip.days} days</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Dates</Typography><Typography fontWeight={700}>{trip.dates}</Typography></Box>
        </Stack>
        <Button href={`/trips/${trip.id}`} variant="contained" color="primary" sx={{ mt: 3 }}>Open trip ↗</Button>
      </CardContent>
    </Card>
  )
}

export function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trips')
      .then((response) => response.json())
      .then(setTrips)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TripsHeader />
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Your travel shelf</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '7rem' }, lineHeight: .88, mt: 1 }}>My Trips</Typography>
        <Typography sx={{ maxWidth: 510, mt: 3, color: 'text.secondary', fontSize: '1.1rem' }}>Keep your upcoming adventures close, from the first idea to the final day.</Typography>
        <Stack spacing={2} sx={{ mt: 7 }}>
          {loading && <Typography color="text.secondary">Loading your trips...</Typography>}
          {!loading && trips.length === 0 && <Typography color="text.secondary">You do not have any trips yet.</Typography>}
          {!loading && trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
        </Stack>
      </Container>
    </Box>
  )
}

export function TripDetails({ trip }) {
  if (!trip) return <Container sx={{ py: 10 }}><Typography variant="h3" fontFamily="Georgia, serif">Trip not found.</Typography><Button href="/trips" sx={{ mt: 2 }}>Back to My Trips</Button></Container>

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TripsHeader />
      <Container sx={{ py: { xs: 5, md: 9 } }}>
        <Button href="/trips" color="primary" sx={{ mb: 3 }}>← Back to My Trips</Button>
        <CardMedia component="img" image={trip.image} alt={trip.destination} sx={{ height: { xs: 280, md: 480 }, objectFit: 'cover' }} />
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={5} sx={{ mt: 5 }}>
          <Box>
            <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.12em' }}>{trip.country} · {trip.status}</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6rem' }, lineHeight: .9 }}>{trip.destination}</Typography>
            <Typography sx={{ mt: 2, maxWidth: 560, color: 'text.secondary', fontSize: '1.1rem' }}>{trip.description}</Typography>
          </Box>
          <Card sx={{ minWidth: { md: 280 }, p: 3, bgcolor: 'background.paper', alignSelf: 'start' }}>
            <Typography variant="h6" fontFamily="Georgia, serif">Trip details</Typography>
            <Typography sx={{ mt: 2 }}>{trip.days} days</Typography>
            <Typography>{trip.dates}</Typography>
            <Button variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>Edit trip</Button>
          </Card>
        </Stack>
        <Typography variant="h4" fontFamily="Georgia, serif" sx={{ mt: 8, mb: 3 }}>Your itinerary</Typography>
        <Stack spacing={1.5}>{trip.itinerary.map((day) => <Card key={day.day} sx={{ p: 2.5, bgcolor: 'background.paper' }}><Typography variant="overline" color="secondary.main">Day {day.day}</Typography><Typography variant="h6" fontFamily="Georgia, serif">{day.title}</Typography><Typography color="text.secondary">{day.plan}</Typography></Card>)}</Stack>
      </Container>
    </Box>
  )
}

export function TripDetailsRoute({ tripId }) {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/trips/${tripId}`)
      .then((response) => response.ok ? response.json() : null)
      .then(setTrip)
      .finally(() => setLoading(false))
  }, [tripId])

  if (loading) return <Container sx={{ py: 10 }}><Typography color="text.secondary">Opening your trip...</Typography></Container>
  return <TripDetails trip={trip} />
}
