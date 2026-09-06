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
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'

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
  const [destination, setDestination] = useState('')
  const [travelers, setTravelers] = useState('2 travelers')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('/api/destinations')
      .then((response) => response.json())
      .then(setDestinations)
      .catch(() => setStatus('Destinations are temporarily unavailable.'))
  }, [])

  async function handleSearch(event) {
    event.preventDefault()
    if (!destination) {
      setStatus('Choose a destination to start exploring.')
      return
    }
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, travelers }),
    })
    const result = await response.json()
    setStatus(result.message)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main">
        <Box component="section" sx={{ minHeight: 760, color: '#fffaf0', background: 'linear-gradient(90deg, rgba(12, 29, 25, .82), rgba(12, 29, 25, .12)), url(https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=85) center/cover' }}>
          <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 1 }}>
            <Toolbar sx={{ width: 'min(1120px, calc(100% - 3rem))', mx: 'auto', px: '0 !important', justifyContent: 'space-between' }}>
              <Link href="/" color="inherit" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif', letterSpacing: '-.06em' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link>
              <Stack direction="row" spacing={4} sx={{ ml: 'auto', mr: 4, display: { xs: 'none', sm: 'flex' } }}>
                <Link href="#destinations" color="inherit" underline="none">Destinations</Link>
                <Link href="#about" color="inherit" underline="none">Our story</Link>
              </Stack>
              <Button variant="outlined" color="inherit" sx={{ borderRadius: 99 }}>Sign in</Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ pt: { xs: 12, md: 20 }, pb: 8 }}>
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '.13em' }}>Travel slowly. See deeply.</Typography>
            <Typography variant="h1" sx={{ maxWidth: 700, fontSize: { xs: '4.2rem', md: '8.5rem' }, lineHeight: .82, letterSpacing: '-.065em', my: 2 }}>Go somewhere<br /><Box component="em" sx={{ color: 'secondary.main' }}>beautiful.</Box></Typography>
            <Typography sx={{ maxWidth: 390, color: '#e5e2d9', fontSize: '1.08rem' }}>Thoughtful trips to the places that stay with you long after you return home.</Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'stretch', flexDirection: { xs: 'column', sm: 'row' }, width: 'min(100%, 730px)', mt: 7, p: .75, color: 'primary.main', bgcolor: '#fffaf0' }}>
              <FormControl fullWidth sx={{ borderRight: { sm: '1px solid #d8d8cc' } }}>
                <InputLabel>Where to?</InputLabel>
                <Select value={destination} label="Where to?" onChange={(event) => setDestination(event.target.value)}>
                  <MenuItem value="">Choose a destination</MenuItem>
                  {destinations.map((place) => <MenuItem key={place.id} value={place.name}>{place.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Who is coming?</InputLabel>
                <Select value={travelers} label="Who is coming?" onChange={(event) => setTravelers(event.target.value)}>
                  <MenuItem value="1 traveler">1 traveler</MenuItem><MenuItem value="2 travelers">2 travelers</MenuItem><MenuItem value="3 travelers">3 travelers</MenuItem><MenuItem value="4+ travelers">4+ travelers</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="secondary" sx={{ minWidth: 170, color: '#fffaf0' }}>Find a trip ↗</Button>
            </Box>
            {status && <Typography role="status" sx={{ mt: 1, fontSize: '.85rem' }}>{status}</Typography>}
          </Container>
        </Box>
        <Container component="section" id="destinations" sx={{ py: { xs: 8, md: 14 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'end' }} spacing={3} mb={4}>
            <Box><Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Handpicked for you</Typography><Typography variant="h2" sx={{ fontSize: { xs: '2.6rem', md: '5rem' }, lineHeight: .95 }}>Places with a pulse.</Typography></Box>
            <Link href="#destinations" color="primary.main" underline="none" sx={{ borderBottom: '1px solid', borderColor: 'secondary.main', pb: .5 }}>View all destinations ↗</Link>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {destinations.map((place) => <Card key={place.id} sx={{ minHeight: 430, position: 'relative', color: '#fffaf0', bgcolor: 'primary.main' }}><CardMedia component="img" image={place.image} alt={place.name} sx={{ height: 430, objectFit: 'cover' }} /><CardContent sx={{ position: 'absolute', inset: 'auto 0 0', pt: 10, background: 'linear-gradient(transparent, rgba(12,29,25,.9))' }}><Typography variant="overline" sx={{ color: '#f1bb76', letterSpacing: '.1em' }}>{place.region}</Typography><Typography variant="h3" sx={{ fontSize: '2rem' }}>{place.name}</Typography><Typography variant="body2" sx={{ color: '#e5e2d9' }}>{place.description}</Typography></CardContent></Card>)}
          </Box>
        </Container>
        <Box component="section" id="about" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.paper' }}><Container><Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '.13em' }}>Why roam?</Typography><Typography variant="h2" sx={{ maxWidth: 760, fontSize: { xs: '2.6rem', md: '5rem' }, lineHeight: .95, mt: 1 }}>The world is wide.<br />Your trip should feel <Box component="em" sx={{ color: 'secondary.main' }}>personal.</Box></Typography><Typography sx={{ maxWidth: 400, color: 'text.secondary', lineHeight: 1.6, mt: 3 }}>We pair curious people with local experts and small places that make a destination feel like yours.</Typography></Container></Box>
        <Container component="footer" sx={{ display: 'flex', justifyContent: 'space-between', py: 3, color: 'text.secondary' }}><Link href="/" color="primary.main" underline="none" sx={{ font: '700 1.7rem/1 Georgia, serif' }}>roam<span style={{ color: '#e9825d' }}>.</span></Link><Typography variant="caption">Made for the curious · 2025</Typography></Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
