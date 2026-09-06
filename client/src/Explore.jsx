import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

export function DestinationCard({ place }) {
  return (
    <Card component="a" href={`/explore/${place.id}`} sx={{ display: 'block', minHeight: 430, position: 'relative', color: '#fffaf0', bgcolor: 'primary.main', textDecoration: 'none', transition: 'transform .25s ease', '&:hover': { transform: 'translateY(-6px)' } }}>
      <CardMedia component="img" image={place.image} alt={place.name} sx={{ height: 430, objectFit: 'cover' }} />
      <CardContent sx={{ position: 'absolute', inset: 'auto 0 0', pt: 10, background: 'linear-gradient(transparent, rgba(12,29,25,.92))' }}>
        <Typography variant="overline" sx={{ color: '#f1bb76', letterSpacing: '.1em' }}>{place.region} · {place.type}</Typography>
        <Typography variant="h3" sx={{ fontSize: '2rem' }}>{place.name}</Typography>
        <Typography variant="body2" sx={{ color: '#e5e2d9' }}>{place.description}</Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1.2, color: '#f1bb76' }}>{place.duration} days · {place.budget} · View trip ↗</Typography>
      </CardContent>
    </Card>
  )
}

export function ExplorePage() {
  const [destinations, setDestinations] = useState([])
  const [filterOptions, setFilterOptions] = useState({ regions: [], budgets: [], durations: [], types: [], sorts: [] })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All regions')
  const [budget, setBudget] = useState('All budgets')
  const [duration, setDuration] = useState('Any duration')
  const [type, setType] = useState('All types')
  const [sort, setSort] = useState('Recommended')

  useEffect(() => {
    fetch('/api/explore/options')
      .then((response) => response.json())
      .then(setFilterOptions)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (region !== 'All regions') params.set('region', region)
    if (budget !== 'All budgets') params.set('budget', budget)
    if (duration !== 'Any duration') params.set('duration', duration)
    if (type !== 'All types') params.set('type', type)
    if (sort !== 'Recommended') params.set('sort', sort)

    fetch(`/api/destinations/search?${params.toString()}`)
      .then((response) => response.json())
      .then((result) => setDestinations(result.destinations))
      .finally(() => setLoading(false))
  }, [query, region, budget, duration, type, sort])

  const selectOptions = (label, value, onChange, options) => (
    <FormControl size="small" sx={{ minWidth: 155, flex: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select>
    </FormControl>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}>
          <Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif', letterSpacing: '-.06em' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link>
          <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ display: { xs: 'none', sm: 'flex' } }}><Link href="/explore" color="inherit" underline="none">Explore</Link><Link href="/#ai-planner" color="inherit" underline="none">AI Planner</Link><Link href="/#trips" color="inherit" underline="none">My Trips</Link></Stack>
          <Button variant="outlined" color="inherit" sx={{ borderRadius: 99 }}>Sign in</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: { xs: 7, md: 10 } }}>
        <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Find your next chapter</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '7rem' }, lineHeight: .88, mt: 1 }}>Explore<br /><Box component="em" sx={{ color: 'secondary.main' }}>destinations.</Box></Typography>
        <Typography sx={{ maxWidth: 500, mt: 3, color: 'text.secondary', fontSize: '1.1rem' }}>Browse places picked for curious travelers, then shape the details around you.</Typography>
        <TextField fullWidth value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destinations or countries" sx={{ mt: 5, bgcolor: '#fff' }} inputProps={{ 'aria-label': 'Search destinations' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={1.5} sx={{ mt: 2 }}>
          {selectOptions('Region', region, setRegion, ['All regions', ...filterOptions.regions])}
          {selectOptions('Budget', budget, setBudget, ['All budgets', ...filterOptions.budgets])}
          {selectOptions('Duration', duration, setDuration, ['Any duration', ...filterOptions.durations])}
          {selectOptions('Trip type', type, setType, ['All types', ...filterOptions.types])}
          {selectOptions('Sort by', sort, setSort, filterOptions.sorts)}
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 7, mb: 2 }}><Typography variant="h5" fontFamily="Georgia, serif">{loading ? 'Finding destinations...' : `${destinations.length} destinations`}</Typography><Typography variant="body2" color="text.secondary">Click a card to explore</Typography></Stack>
        {!loading && (destinations.length > 0 ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>{destinations.map((place) => <DestinationCard key={place.id} place={place} />)}</Box> : <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'background.paper' }}><Typography variant="h5" fontFamily="Georgia, serif">No destinations match those filters.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Try widening your search.</Typography></Box>)}
      </Container>
      <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#fffaf0', py: 5 }}><Container><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={3}><Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link><Typography variant="caption" sx={{ color: '#c7d1c7' }}>Made for the curious · 2025</Typography></Stack></Container></Box>
    </Box>
  )
}

export function DestinationDetails({ destination }) {
  if (!destination) return <Container sx={{ py: 10 }}><Typography variant="h3">Destination not found.</Typography><Button href="/explore" sx={{ mt: 2 }}>Back to explore</Button></Container>
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}><AppBar position="static" color="primary" elevation={0}><Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}><Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link><Button href="/explore" color="inherit">← Back to explore</Button></Toolbar></AppBar><Container sx={{ py: { xs: 5, md: 9 } }}><CardMedia component="img" image={destination.image} alt={destination.name} sx={{ height: { xs: 300, md: 520 }, objectFit: 'cover' }} /><Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={4} sx={{ mt: 4 }}><Box><Typography variant="overline" color="secondary.main">{destination.region} · {destination.type}</Typography><Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6rem' }, lineHeight: .9 }}>{destination.name}</Typography><Typography sx={{ maxWidth: 560, mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>{destination.description}</Typography></Box><Card sx={{ minWidth: { md: 280 }, p: 3, bgcolor: 'background.paper', alignSelf: 'start' }}><Typography variant="h6" fontFamily="Georgia, serif">Trip snapshot</Typography><Typography sx={{ mt: 2 }}>{destination.duration} days</Typography><Typography>{destination.budget} budget</Typography><Button variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>Plan this trip ↗</Button></Card></Stack></Container></Box>
}
