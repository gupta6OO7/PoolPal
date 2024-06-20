import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import cpimage from './bgim/poolreq.jpg'

const darkTheme = createTheme({
  palette: {
      mode: 'dark',
      primary: {
          main: '#1976d2',
      },
  },
});

export default function PoolReq() {

  let navigate = useNavigate();
  const [userName, setuserName] = useState('');
  const [userId, setuserId] = useState('');

  useEffect(() => {
    async function authorize() {
      const response = await fetch('https://pool-pal-api.vercel.app/api/extractUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
      });
      const json = await response.json()
      setuserName(json.userName);
      setuserId(json.userId);
    }
    authorize();
  }, [])

  const [creds, setcreds] = useState({
    fromloc: "",
    toloc: "",
    vtype: "",
    deptime: "",
    depdate: "",
    totalseats: "",
    seatsleft: ""
  })

  const handleSubmit = async (e) => {

    e.preventDefault();
    const response = await fetch('https://pool-pal-api.vercel.app/api/createpmsg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromloc: creds.fromloc,
        toloc: creds.toloc,
        vtype: creds.vtype,
        deptime: creds.deptime,
        depdate: creds.depdate,
        totalseats: creds.totalseats,
        seatsleft: creds.seatsleft,
        username: userName,
        ownerId: userId
      })
    });

    const json = await response.json()
    if (!json.success) {
      alert('Enter Valid Details');
    }
    else {
      navigate('/');
    }
  }

  const onChange = (event) => {
    setcreds({ ...creds, [event.target.name]: event.target.value })
  }


  return (

    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${cpimage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <AddCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Pool Request
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="fromloc"
                label="From"
                name="fromloc"
                onChange={onChange}
                value={creds.fromloc}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="toloc"
                label="To"
                name="toloc"
                onChange={onChange}
                value={creds.toloc}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="vtype"
                label="Vehicle Type"
                name="vtype"
                onChange={onChange}
                value={creds.vtype}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="deptime"
                label="Departure Time"
                name="deptime"
                InputLabelProps={{ shrink: true }}
                type="time"
                onChange={onChange}
                value={creds.deptime}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="depdate"
                label="Departure Date"
                InputLabelProps={{ shrink: true }}
                name="depdate"
                type="date"
                onChange={onChange}
                value={creds.depdate}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="totalseats"
                label="Total Seats"
                name="totalseats"
                type="number"
                onChange={onChange}
                value={creds.totalseats}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="seatsleft"
                label="Seats left"
                name="seatsleft"
                type="number"
                onChange={onChange}
                value={creds.seatsleft}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
