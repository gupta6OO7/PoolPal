import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import UpdateIcon from '@mui/icons-material/Update';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import cpimage from './bgim/driver.jpg'

const darkTheme = createTheme({
  palette: {
      mode: 'dark',
      primary: {
          main: '#1976d2',
      },
  },
});

export default function DriverStatus() {

  const [userId, setuserId] = useState('');

  useEffect(() => {
    async function authorize() {
      const response = await fetch('http://localhost:5000/api/extractUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
      });
      const json = await response.json()
      setuserId(json.userId);
    }
    authorize();
  }, [])

  const [creds, setcreds] = useState({
    availability: "Busy",
    location: "",
    vtype: "",
    seats: "",
    depdate: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/statusUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        availability: creds.availability,
        location: creds.location,
        vtype: creds.vtype,
        seats: creds.seats,
        driverId: userId,
        depdate: creds.depdate
      })
    });
    const json = await response.json()
    if (!json.success) {
      alert(json.errors);
    }
    else {
      alert("Status Updated Successfully");
    }
  }

  const onChange = (event) => {
    setcreds({ ...creds, [event.target.name]: event.target.value })
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: '100vh' }} paddingTop={'40px'}>
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
              <UpdateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Status
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Availability*</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name='availability'
                  value={creds.availability}
                  label="Availability"
                  onChange={onChange}
                >
                  <MenuItem value={"Busy"}>Busy</MenuItem>
                  <MenuItem value={"Idle"}>Idle</MenuItem>
                </Select>
              </FormControl>
              {
                (creds.availability === 'Idle') ?
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="location"
                      label="Location"
                      name="location"
                      onChange={onChange}
                      value={creds.location}
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="seats"
                      label="Seats"
                      name="seats"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      onChange={onChange}
                      value={creds.seats}
                      autoFocus
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
                      autoFocus
                    />
                  </>
                  :
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="depdate"
                    label="When you will be free?"
                    name="depdate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={onChange}
                    value={creds.depdate}
                    autoFocus
                  />
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}