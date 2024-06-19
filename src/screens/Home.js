import React from 'react'
import Navbar from '../components/Navbar'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MyPools from './MyPools';
import PoolPage from './PoolPage';
import DriverPage from './DriverPage';
import PoolReq from './PoolReq';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Home() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Navbar></Navbar>
                <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        display: 'flex',
                        paddingTop: '100px'
                    }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Create a Pool" {...a11yProps(0)} />
                        <Tab label="Join Pool" {...a11yProps(1)} />
                        <Tab label="Book a Cab" {...a11yProps(2)} />
                        <Tab label="My Pools" {...a11yProps(3)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                    <PoolReq></PoolReq>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <PoolPage></PoolPage>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <DriverPage></DriverPage>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <MyPools></MyPools>
                    </TabPanel>
                </Box>
            </ThemeProvider>
        </>
    )
}
