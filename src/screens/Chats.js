import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import io from "socket.io-client";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled';
import TextField from '@mui/material/TextField';
import SendSharpIcon from '@mui/icons-material/SendSharp';

export default function Chats(props) {

    const [data, setdata] = useState([]);
    const [date, setdate] = useState('');
    const [chatnum, setchatnum] = useState('none');
    const [curr_chat, setcurr_chat] = useState([]);
    const [curr_status, setcurr_status] = useState('');
    const [message, setmessage] = useState('');
    const [req_mailid, setreq_mailid] = useState('none');

    const [userId, setuserId] = useState('');
    const [currEmail, setcurrEmail] = useState('');
    const [userType, setuserType] = useState('');

    const [socket, setSocket] = useState(null);

    const LeftMsg = styled(Button)({
        textTransform: 'none',
        backgroundColor: '#DADADA',
    });

    const RightMsg = styled(Button)({
        textTransform: 'none',
        backgroundColor: '#DBE2E9',
    });

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
            setcurrEmail(json.userEmail);
            setuserType(json.userType);

            const nextresponse = await fetch('http://localhost:5000/api/getuserchatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: json.userId })
            });
            const nextjson = await nextresponse.json()
            setdata(nextjson.chatrooms);
        }
        authorize();
    }, []);

    useEffect(() => {
        const s = io("http://localhost:5000")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("message recieved", (newMessageRecieved) => {
            setcurr_chat([...curr_chat, newMessageRecieved]);
        });
    }, [socket, curr_chat]);

    useEffect(() => {
        if (!socket) return;

        socket.on("status recieved", (basket) => {
            setcurr_status(basket.status);
        });
    }, [socket]);

    const handleMessage = (e) => {
        setmessage(e.target.value);
    }

    const handleDate = (e) => {
        setdate(e.target.value);
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/sendmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatnum, sender_mailid: currEmail, message: message })
        });
        const json = await response.json();
        if (!json.success) {
            alert('Failed to send message');
        }
        else {
            var sdata = { chat: chatnum, sender: currEmail, message: message };
            setmessage(".");
            socket.emit("new message", sdata);
            setcurr_chat([...curr_chat, sdata]);
        }
    }

    const getchat = async (chatid, mailId) => {
        setchatnum(chatid);
        setreq_mailid(mailId);
        const response = await fetch('http://localhost:5000/api/getchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatid })
        });
        const json = await response.json();
        setcurr_chat(json.msgdata);
        setcurr_status(json.status);

        socket.emit("get-chatroom", chatid);
    }

    const handleUpdate = async (chatid) => {
        if (userType === 'Driver' && date === '') {
            alert('Enter date first');
        }
        else {
            const response = await fetch('http://localhost:5000/api/updatestatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chat_id: chatid, date: date, userId: userId })
            });
            const json = await response.json();
            setcurr_status(json.status);

            var basket = { chatId: chatid, status: json.status };
            socket.emit("update-status", basket);
        }
    }

    const formatDate = (date) => {
        let month = date[5] + date[6];
        let day = date[8] + date[9];
        let year = date[0] + date[1] + date[2] + date[3];
        let monthNames = ["January", "February", "March", "April",
            "May", "June", "July", "August", "September",
            "October", "November", "December"];
        let monthName = monthNames[parseInt(month) - 1];
        return `${day} ${monthName}, ${year}`;
    }

    return (
        <ThemeProvider
            theme={createTheme({
                components: {
                    MuiListItemButton: {
                        defaultProps: {
                            disableTouchRipple: true,
                        },
                    },
                },
                palette: {
                    mode: 'dark',
                    primary: { main: '#A9A9A9' },
                    background: { paper: '#A9A9A9' },
                },
            })}
        >
            <Box sx={{ width: 360 }} role="presentation">
                {
                    chatnum === 'none' ? <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: '##A9A9A9' }}
                    >
                        <Grid container>
                            <Grid paddingLeft={'10px'}>
                                <ArrowBackIcon onClick={props.toggleDrawer(false)}></ArrowBackIcon>
                            </Grid>
                        </Grid>
                        {
                            data.map((item) => {
                                return (
                                    <>
                                        <ListItem alignItems="flex-start" onClick={() => getchat(item.chatid, item.mailid)}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#E7ECFF' }} aria-label="recipe">
                                                    {item.username.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.fromloc + ' to ' + item.toloc}
                                                secondary={
                                                    <React.Fragment>
                                                        {"Departing on " + formatDate(item.depdate) + " in " + item.vtype + "."}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" /></>
                                )
                            })
                        }
                    </List > : <Box padding={'15px'}>
                        <Grid container>
                            <Grid paddingBottom={'10px'}>
                                <ArrowBackIcon onClick={() => setchatnum('none')}></ArrowBackIcon>
                            </Grid>
                        </Grid>



                        <Box sx={{ '& button': { m: 1 } }}>
                            {curr_status === '0' && currEmail === req_mailid &&
                                <Button variant="outlined" onClick={() => handleUpdate(chatnum)}>
                                    Send Request
                                </Button>
                            }
                            {curr_status === '1' && currEmail !== req_mailid &&
                                <>
                                    <Button variant="outlined" onClick={() => handleUpdate(chatnum)}>
                                        Accept Request
                                    </Button>
                                    {
                                        userType === 'Driver' &&
                                        <>
                                            <TextField
                                                id="date"
                                                label="When you will be free?"
                                                variant="outlined"
                                                value={date}
                                                onChange={handleDate}
                                            />
                                        </>
                                    }
                                </>
                            }
                            {curr_status === '2' &&
                                <Button variant="outlined">
                                    Request Accepted
                                </Button>
                            }
                        </Box>

                        <Divider />
                        <br />

                        <Grid container spacing={1}>
                            {
                                curr_chat.map((item) => {
                                    return (
                                        <>
                                            {
                                                item.sender === currEmail &&
                                                <Grid
                                                    xs={8}
                                                    mdOffset="auto"
                                                    align={'right'}
                                                >
                                                    <RightMsg variant="contained">
                                                        {item.message}
                                                    </RightMsg>
                                                </Grid>
                                            }
                                            {
                                                item.sender !== currEmail &&
                                                <Grid
                                                    xs={8}
                                                >
                                                    <LeftMsg variant="contained">
                                                        {item.message}
                                                    </LeftMsg>
                                                </Grid>
                                            }
                                        </>
                                    )
                                })
                            }

                        </Grid>

                        <br />
                        <Divider />
                        <br />

                        <Grid container>
                            <Grid xs={10}>
                                <TextField
                                    id="msgbox"
                                    label="Type your message here"
                                    variant="outlined"
                                    size='small'
                                    value={message}
                                    onChange={handleMessage}
                                />
                            </Grid>
                            <Grid>
                                <SendSharpIcon onClick={handleSendMessage}>
                                </SendSharpIcon>
                            </Grid>
                        </Grid>

                    </Box>
                }
            </Box >
        </ThemeProvider>
    );
}