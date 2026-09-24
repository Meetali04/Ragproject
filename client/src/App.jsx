import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Divider,
  Link,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import { DestinationDetails, ExplorePage } from './Explore'
import { TripDetailsRoute, TripsPage } from './Trips'
import { AIPlannerPage } from './AIPlanner'

const theme = createTheme({
  palette: {
    primary: { main: '#17352d' },
    secondary: { main: '#e9825d' },
    background: { default: '#fffaf0', paper: '#e7e1d1' },
    text: { primary: '#17352d', secondary: '#59675e' },
  },
  typography: {
    fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
    h1: { fontFamily: 'Georgia, serif', fontWeight: 400 },
    h2: { fontFamily: 'Georgia, serif', fontWeight: 400 },
    h3: { fontFamily: 'Georgia, serif', fontWeight: 400 },
  },
  shape: { borderRadius: 0 },
})

function App() {
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    fetch('/api/destinations')
      .then((response) => response.json())
      .then(setDestinations)
      .catch(() => setDestinations([]))
  }, [])

  const path = window.location.pathname
  if (path === '/explore') return <ThemeProvider theme={theme}><CssBaseline /><ExplorePage /></ThemeProvider>
  if (path === '/trips') return <ThemeProvider theme={theme}><CssBaseline /><TripsPage /></ThemeProvider>
  if (path === '/ai-planner') return <ThemeProvider theme={theme}><CssBaseline /><AIPlannerPage /></ThemeProvider>
  if (path.startsWith('/trips/')) {
    return <ThemeProvider theme={theme}><CssBaseline /><TripDetailsRoute tripId={path.split('/')[2]} /></ThemeProvider>
  }
  if (path.startsWith('/explore/')) {
    const destination = destinations.find((place) => String(place.id) === path.split('/')[2])
    return <ThemeProvider theme={theme}><CssBaseline /><DestinationDetails destination={destination} /></ThemeProvider>
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main">
        <AppBar position="absolute" color="transparent" elevation={0} sx={{ top: 0, pt: 1, zIndex: 2 }}>
          <Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}>
            <Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif', letterSpacing: '-.06em' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link>
            <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ ml: 'auto', mr: { xs: 2, md: 4 }, display: { xs: 'none', sm: 'flex' } }}>
              <Link href="/explore" color="inherit" underline="none">Explore</Link>
              <Link href="/ai-planner" color="inherit" underline="none">AI Planner</Link>
              <Link href="/trips" color="inherit" underline="none">My Trips</Link>
            </Stack>
            <Button variant="outlined" color="inherit" sx={{ borderRadius: 99 }}>Sign in</Button>
          </Toolbar>
        </AppBar>
        <Box component="section" sx={{ minHeight: 760, color: '#fffaf0', background: 'linear-gradient(90deg, rgba(12, 29, 25, .86), rgba(12, 29, 25, .2)), url(https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=85) center/cover' }}>
          <Container sx={{ pt: { xs: 18, md: 23 }, pb: 10 }}>
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '.13em' }}>Your smarter way to wander</Typography>
            <Typography variant="h1" sx={{ maxWidth: 850, fontSize: { xs: '4rem', md: '7.5rem' }, lineHeight: .87, letterSpacing: '-.06em', my: 2 }}>Plan your next<br /><Box component="em" sx={{ color: 'secondary.main' }}>adventure with AI.</Box></Typography>
            <Typography sx={{ maxWidth: 460, color: '#e5e2d9', fontSize: '1.12rem', lineHeight: 1.5 }}>Create personalized itineraries using intelligent recommendations built around the way you want to travel.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
              <Button href="/ai-planner" variant="contained" color="secondary" sx={{ color: '#fffaf0', px: 3, py: 1.5 }}>Try AI planner ↗</Button>
              <Button href="/explore" variant="outlined" color="inherit" sx={{ px: 3, py: 1.5 }}>Explore destinations</Button>
            </Stack>
          </Container>
        </Box>
        <Container component="section" id="destinations" sx={{ py: { xs: 8, md: 14 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'end' }} spacing={3} mb={4}>
            <Box><Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Popular destinations</Typography><Typography variant="h2" sx={{ fontSize: { xs: '2.6rem', md: '5rem' }, lineHeight: .95 }}>Places with a pulse.</Typography></Box>
            <Link href="#destinations" color="primary.main" underline="none" sx={{ borderBottom: '1px solid', borderColor: 'secondary.main', pb: .5 }}>View all destinations ↗</Link>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {destinations.map((place) => <Card key={place.id} sx={{ minHeight: 430, position: 'relative', color: '#fffaf0', bgcolor: 'primary.main' }}><CardMedia component="img" image={place.image} alt={place.name} sx={{ height: 430, objectFit: 'cover' }} /><CardContent sx={{ position: 'absolute', inset: 'auto 0 0', pt: 10, background: 'linear-gradient(transparent, rgba(12,29,25,.9))' }}><Typography variant="overline" sx={{ color: '#f1bb76', letterSpacing: '.1em' }}>{place.region}</Typography><Typography variant="h3" sx={{ fontSize: '2rem' }}>{place.name}</Typography><Typography variant="body2" sx={{ color: '#e5e2d9' }}>{place.description}</Typography></CardContent></Card>)}
          </Box>
        </Container>
        <Box component="section" id="ai-planner" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.paper' }}>
          <Container>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 5, md: 10 }} alignItems="center">
              <Box sx={{ flex: 1 }}><Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Meet your travel co-pilot</Typography><Typography variant="h2" sx={{ maxWidth: 620, fontSize: { xs: '2.6rem', md: '5rem' }, lineHeight: .95, mt: 1 }}>A better trip starts with a <Box component="em" sx={{ color: 'secondary.main' }}>conversation.</Box></Typography><Typography sx={{ maxWidth: 430, color: 'text.secondary', lineHeight: 1.6, mt: 3 }}>Tell our AI what you love, and get a thoughtful route with places to stay, eat, and explore.</Typography><Button href="/ai-planner" variant="contained" color="primary" sx={{ mt: 4, px: 3, py: 1.5 }}>Try AI planner ↗</Button></Box>
              <Card sx={{ flex: 1, width: '100%', maxWidth: 520, p: { xs: 2, md: 3 }, bgcolor: '#fffaf0', border: '1px solid #d8d8cc', boxShadow: '0 18px 45px rgba(23,53,45,.12)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography fontWeight={700}>roam AI</Typography><Typography variant="caption" color="text.secondary">Online now</Typography></Stack><Divider />
                <Stack spacing={2.2} sx={{ py: 3 }}><Box sx={{ alignSelf: 'flex-end', maxWidth: '82%', p: 1.5, bgcolor: 'primary.main', color: '#fffaf0' }}><Typography variant="body2">I want a relaxed 5-day trip with food, art, and coastal views.</Typography></Box><Box sx={{ maxWidth: '88%', p: 1.5, bgcolor: '#e7e1d1' }}><Typography variant="body2">I have a few ideas. How about Lisbon? I can balance slow mornings in Alfama with galleries, seafood, and a day along the coast.</Typography></Box><Box sx={{ alignSelf: 'flex-end', maxWidth: '82%', p: 1.5, bgcolor: 'primary.main', color: '#fffaf0' }}><Typography variant="body2">That sounds perfect. Build the itinerary.</Typography></Box></Stack><Button fullWidth variant="outlined" color="secondary">Start planning your trip</Button>
              </Card>
            </Stack>
          </Container>
        </Box>
        <Box component="section" id="trips" sx={{ py: { xs: 8, md: 12 } }}><Container><Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Why roam?</Typography><Typography variant="h2" sx={{ maxWidth: 760, fontSize: { xs: '2.6rem', md: '5rem' }, lineHeight: .95, mt: 1 }}>The world is wide.<br />Your trip should feel <Box component="em" sx={{ color: 'secondary.main' }}>personal.</Box></Typography><Typography sx={{ maxWidth: 400, color: 'text.secondary', lineHeight: 1.6, mt: 3 }}>We pair curious people with local experts and small places that make a destination feel like yours.</Typography></Container></Box>
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#fffaf0', py: 5 }}><Container><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={3}><Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link><Stack direction="row" spacing={3}><Link href="/explore" color="inherit" underline="none">Explore</Link><Link href="#ai-planner" color="inherit" underline="none">AI Planner</Link><Link href="/trips" color="inherit" underline="none">My Trips</Link></Stack><Typography variant="caption" sx={{ color: '#c7d1c7' }}>Made for the curious · 2025</Typography></Stack></Container></Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
