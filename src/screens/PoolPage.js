import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { orange } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import LockIcon from '@mui/icons-material/Lock';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

const defaultTheme = createTheme();

export default function PoolPage() {

    const [data, setdata] = useState([]);
    const [showpoolpageData, setshowpoolpageData] = useState(false);
    const [searchfrom, setsearchfrom] = useState('');
    const [searchto, setsearchto] = useState('');
    const [searchvtype, setsearchvtype] = useState('');

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
            setuserId(json.userId);
            console.log(json.userId);
        }
        authorize();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextresponse = await fetch('https://pool-pal-api.vercel.app/api/getpoolmsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromloc: searchfrom, toloc: searchto })
        })

        const nextjson = await nextresponse.json()

        console.log(nextjson);

        if (nextjson.status === 'ok') {
            setdata(nextjson.data);
            setshowpoolpageData(true);
        }
    }

    const joinpool = async (msgid, ownerId) => {
        const response = await fetch('https://pool-pal-api.vercel.app/api/createchatroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ req_id: userId, owner_id: ownerId, pmsg_id: msgid })
        });
        const json = await response.json()
        if (!json.success) {
            alert('Failed to create chatroom');
        }
        else {
            alert('Chatroom created');
        }
    }

    const formatDate = (date) => {
        let month = date[5] + date[6];
        let day = date[8] + date[9];
        let year = date[0] + date[1] + date[2] + date[3];
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
        let monthName = monthNames[parseInt(month) - 1];
        return `${day} ${monthName}, ${year}`;
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
                {
                    (!showpoolpageData) ?
                        <Box sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <TextField
                                id="fromloc"
                                label="From"
                                variant="outlined"
                                value={searchfrom}
                                onChange={(e) => { setsearchfrom(e.target.value) }}
                            />
                            <br></br>
                            <TextField
                                id="toloc"
                                label="To"
                                variant="outlined"
                                value={searchto}
                                onChange={(e) => { setsearchto(e.target.value) }}
                            />
                            <Button
                                onClick={handleSubmit}
                                fullWidth
                                padding="10px"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Search
                            </Button>
                        </Box>
                        :
                        <TextField
                            id="vtype"
                            label="Vehicle Type"
                            variant="outlined"
                            value={searchvtype}
                            onChange={(e) => { setsearchvtype(e.target.value) }}
                        />
                }
            </Box>

            <br />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={25}>
                    {data.filter((i) => ((i.vtype.toLowerCase().includes(searchvtype.toLocaleLowerCase()))))
                        .map(i => {
                            return (
                                <Grid xs={4}>
                                    <ThemeProvider theme={defaultTheme}>
                                        <Card variant="outlined" sx={{minWidth: '300px'}}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar sx={{ bgcolor: orange[400] }} aria-label="recipe">
                                                        {i.username.charAt(0)}
                                                    </Avatar>
                                                }
                                                action={
                                                    <IconButton aria-label="settings">
                                                        {
                                                            (!localStorage.getItem('authToken')) ?
                                                                <LockIcon> </LockIcon>
                                                                : <ChatIcon
                                                                    onClick={() => joinpool(i._id, i.ownerId)}
                                                                ></ChatIcon>
                                                        }
                                                    </IconButton>
                                                }
                                                title={i.vtype}
                                                subheader={formatDate(i.depdate)}
                                            />
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {i.fromloc} - {i.toloc}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {i.seatsleft} out of {i.totalseats} seats left.
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
