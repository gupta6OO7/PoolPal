import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const defaultTheme = createTheme();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#ffffff',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

export default function MyPools() {

    const [data, setdata] = useState([]);

    const [epoolId, setepoolId] = useState('');

    const [creds, setcreds] = useState({
        fromloc: "",
        toloc: "",
        vtype: "",
        deptime: "",
        depdate: "",
        totalseats: "",
        seatsleft: ""
    })

    const onChange = (event) => {
        setcreds({ ...creds, [event.target.name]: event.target.value })
    }

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

            const nextresponse = await fetch('https://pool-pal-api.vercel.app/api/getpoolmsg', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const nextjson = await nextresponse.json()
            setdata(nextjson.data);
        }
        authorize();
    }, []);


    const handleEdit = async (e) => {

        e.preventDefault();
        const response = await fetch('https://pool-pal-api.vercel.app/api/editpmsg', {
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
                poolId: epoolId
            })
        });

        const json = await response.json()
        if (!json.success) {
            alert('Failed to edit pool');
        }
        else {
            setepoolId('');
            alert('Pool edited');
            const updatedData = data.map(item => {
                if (item._id === epoolId) {
                    item.fromloc = creds.fromloc;
                    item.toloc = creds.toloc;
                    item.vtype = creds.vtype;
                    item.deptime = creds.deptime;
                    item.depdate = creds.depdate;
                    item.totalseats = creds.totalseats;
                    item.seatsleft = creds.seatsleft;
                }
                return item;
            });
            setdata(updatedData);
        }
    }

    const handleDelete = async (msgid) => {
        const response = await fetch('https://pool-pal-api.vercel.app/api/deletepmsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                poolId: msgid
            })
        });

        const json = await response.json()
        if (!json.success) {
            alert('Failed to delete pool');
        }
        else {
            alert('Pool deleted');
            const updatedData = data.filter(item => item._id !== msgid);
            setdata(updatedData);
        }
    }

    const handleBeforeEdit = async (poolid, fromloc, toloc, vtype, deptime, depdate, totalseats, seatsleft) => {

        setepoolId(poolid);
        setcreds({
            fromloc: fromloc,
            toloc: toloc,
            vtype: vtype,
            deptime: deptime,
            depdate: depdate,
            totalseats: totalseats,
            seatsleft: seatsleft
        });
        setOpen(true);
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

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {data.map(i => {
                        return (
                            <Grid xs={3}>
                                <ThemeProvider theme={defaultTheme}>
                                    {
                                        (i.ownerId === userId) ?
                                            <Card variant="outlined" sx={{ minWidth: 400 }}>
                                                <CardHeader
                                                    avatar={<>
                                                        <DriveFileRenameOutlineIcon
                                                            fontSize="large"
                                                            onClick={() => handleBeforeEdit(i._id, i.fromloc, i.toloc, i.vtype, i.deptime, i.depdate, i.totalseats, i.seatsleft)}
                                                        />
                                                        <Modal
                                                            open={open}
                                                            onClose={handleClose}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box component="form" onSubmit={handleEdit} noValidate sx={style}>
                                                                <TextField
                                                                    margin="normal"
                                                                    required
                                                                    fullWidth
                                                                    id="fromloc"
                                                                    label="From"
                                                                    name="fromloc"
                                                                    onChange={onChange}
                                                                    value={creds.fromloc}
                                                                    size="small"
                                                                    autoFocus
                                                                />
                                                                <TextField
                                                                    margin="normal"
                                                                    required
                                                                    fullWidth
                                                                    id="toloc"
                                                                    label="To"
                                                                    name="toloc"
                                                                    size="small"
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
                                                                    size="small"
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
                                                                    size="small"
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
                                                                    size="small"
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
                                                                    size="small"
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
                                                                    size="small"
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
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{ mt: 3, mb: 2 }}
                                                                >
                                                                    Save Changes
                                                                </Button>
                                                            </Box>
                                                        </Modal>
                                                    </>
                                                    }
                                                    action={
                                                        <DeleteForeverIcon
                                                            fontSize="large"
                                                            onClick={() => handleDelete(i._id)}
                                                        />
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
                                            : <></>
                                    }
                                </ThemeProvider>
                            </Grid>

                        )
                    })}
                </Grid>
            </Box>
        </>
    )
}
