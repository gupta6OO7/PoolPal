import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Chats from '../screens/Chats';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';

export default function Navbar() {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

    let navigate = useNavigate();

    const [state, setState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(open);
    };

    const handlelogout = () => {
        console.log(localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');

        navigate('/login');
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar component="nav">
                    <Toolbar>
                        <DriveEtaIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            POOLPAL
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {
                                (!localStorage.getItem('authToken')) ?
                                    <>
                                        <Button
                                            sx={{ color: '#fff' }}
                                            component={Link}
                                            to="/login">Login</Button>
                                        <Button
                                            sx={{ color: '#fff' }}
                                            component={Link}
                                            to="/signup">Signup</Button>
                                    </>
                                    :
                                    <>
                                        <Button sx={{ color: '#fff' }} onClick={toggleDrawer(true)}>Chat</Button>
                                        <Drawer
                                            anchor={'right'}
                                            open={state}
                                            onClose={toggleDrawer(false)}
                                        >
                                            <Chats toggleDrawer={toggleDrawer}> </Chats>
                                        </Drawer>
                                        <Button
                                            sx={{ color: '#fff' }}
                                            onClick={handlelogout}>Logout</Button>
                                    </>
                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    )
}
