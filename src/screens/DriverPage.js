import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import LockIcon from '@mui/icons-material/Lock';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function DriverPage() {

    const [data, setdata] = useState([]);
    const [searchfrom, setsearchfrom] = useState('');
    const [searchvtype, setsearchvtype] = useState('');

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

            const nextresponse = await fetch('http://localhost:5000/api/getdriverdata', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const nextjson = await nextresponse.json()
            setdata(nextjson.data);
        }
        authorize();
    }, []);

    const bookCab = async (ownerId) => {
        const response = await fetch('http://localhost:5000/api/createchatroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ req_id: userId, owner_id: ownerId, pmsg_id: '' })
        });
        const json = await response.json()
        if (!json.success) {
            alert('Failed to create chatroom');
        }
        else {
            alert('Chatroom created');
        }
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '40ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="from"
                    label="From"
                    variant="outlined"
                    value={searchfrom}
                    onChange={(e) => { setsearchfrom(e.target.value) }}
                />
                <TextField
                    id="vtype"
                    label="Vehicle Type"
                    variant="outlined"
                    value={searchvtype}
                    onChange={(e) => { setsearchvtype(e.target.value) }}
                />
            </Box>

            <br />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {data.filter((i) => ((i.location.toLowerCase().includes(searchfrom.toLocaleLowerCase()))
                        && (i.vtype.toLowerCase().includes(searchvtype.toLocaleLowerCase()))
                    ))
                        .map(i => {
                            return (
                                <Grid xs={6}>
                                    <ThemeProvider theme={defaultTheme}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                action={
                                                    <IconButton aria-label="settings">
                                                        {
                                                            (!localStorage.getItem('authToken')) ?
                                                                <LockIcon> </LockIcon>
                                                                : <ChatIcon
                                                                    onClick={() => bookCab(i.driverId)}
                                                                ></ChatIcon>
                                                        }
                                                    </IconButton>
                                                }
                                                title={i.vtype}
                                                subheader={i.location}
                                            />
                                            <CardContent>
                                                <Typography variant="body2">
                                                    This vehicle has occupancy of {i.seats} passengers.
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </ThemeProvider>
                                </Grid>
                            )
                        })}
                </Grid>
            </Box>
        </>
    )
}
