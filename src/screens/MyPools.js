import React, { useState, useEffect } from 'react'

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
            const response = await fetch('http://localhost:5000/api/extractUserData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
            });

            const json = await response.json()
            setuserId(json.userId);
            console.log(json.userId);

            const nextresponse = await fetch('http://localhost:5000/api/getpoolmsg', {
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
        const response = await fetch('http://localhost:5000/api/editpmsg', {
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
        }
    }

    const handleDelete = async (msgid) => {
        const response = await fetch('http://localhost:5000/api/deletepmsg', {
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
    }


    return (
        <div style={{ padding: "100px" }}>
            <div className="row row-cols-1 row-cols-md-2 g-4" >
                {data.map(i => {
                    return (
                        <div className='col'>
                            {
                                (i.ownerId === userId && epoolId !== i._id) ?
                                    <div className="card "
                                        style={{ padding: '10px', width: '650px' }}>
                                        <div className="card-body">
                                            <div className='cardb'>
                                                <div className='cardb'>
                                                    <h3 className="card-title">{i.fromloc} - {i.toloc} <span style={{ fontSize: '20px' }}>({i.vtype})</span> </h3>
                                                </div>
                                                <div>
                                                    <button className="btn m-3 btn-outline-dark"
                                                        onClick={() => handleBeforeEdit(i._id, i.fromloc, i.toloc, i.vtype, i.deptime, i.depdate, i.totalseats, i.seatsleft)}>Edit</button>
                                                </div>
                                                <div>
                                                    <button className="btn m-3 btn-outline-dark"
                                                        onClick={() => handleDelete(i._id)}>Delete</button>
                                                </div>
                                            </div>

                                            <div className='cardb'>
                                                <div>{i.deptime}</div>
                                                <div className='d-flex ms-auto'>Pal - {i.username}</div>
                                            </div>
                                            <div className='cardb'>
                                                <div>{i.depdate}</div>
                                                <div className='d-flex ms-auto'>Seats - {i.seatsleft} / {i.totalseats}</div>
                                            </div>

                                        </div>
                                    </div>
                                    : <></>
                            }
                            {
                                (i.ownerId === userId && epoolId === i._id) ?
                                    <div className="card ">
                                        <div>
                                            <form onSubmit={handleEdit}>
                                                <div className="form-group">
                                                    <label for="name">From</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="from"
                                                        placeholder="Initial Location"
                                                        name='fromloc'
                                                        value={creds.fromloc}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">To</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="too"
                                                        placeholder="Destination"
                                                        name='toloc'
                                                        value={creds.toloc}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">Vehicle Type</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="vt"
                                                        placeholder="For example: Jeep"
                                                        name='vtype'
                                                        value={creds.vtype}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">Departure Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        id="time"
                                                        name='deptime'
                                                        value={creds.deptime}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">Departure Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="date" name='depdate'
                                                        value={creds.depdate}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">Total Seats</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="ts"
                                                        name='totalseats'
                                                        value={creds.totalseats}
                                                        onChange={onChange}></input>
                                                </div>

                                                <div className="form-group">
                                                    <label for="name">Seats left</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="sl"
                                                        name='seatsleft'
                                                        value={creds.seatsleft}
                                                        onChange={onChange}></input>
                                                </div>

                                                <button type="submit" className="btn m-3 btn-primary">Save</button>

                                            </form>
                                        </div>
                                    </div>
                                    : <></>
                            }
                        </div>

                    )
                })}
            </div>
        </div>
    )
}
