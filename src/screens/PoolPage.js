import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PoolPage() {

    let navigate = useNavigate();
    const [data, setdata] = useState([]);
    const [searchfrom, setsearchfrom] = useState('');
    const [searchto, setsearchto] = useState('');
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
            console.log(json.userId);
            fetch('http://localhost:5000/api/getpoolmsg', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    setdata(data.data);
                })
        }
        authorize();
    }, []);

    const joinpool = async (msgid, ownerId) => {
        const response = await fetch('http://localhost:5000/api/createchatroom', {
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
            navigate('/chats');
        }
    }

    return (
        <div style={{ padding: "100px" }}>
            <div className='cardb'>
                <div style={{ display: 'flex' }}>
                    <div>
                        <input
                            type="text"
                            placeholder='From'
                            className="form-control"
                            value={searchfrom}
                            onChange={(e) => { setsearchfrom(e.target.value) }}
                        ></input>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder='To'
                            className="form-control"
                            value={searchto}
                            onChange={(e) => { setsearchto(e.target.value) }}
                        ></input>
                    </div>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder='Vehicle Type'
                        className="form-control"
                        value={searchvtype}
                        onChange={(e) => { setsearchvtype(e.target.value) }}
                    ></input>
                </div>
            </div>

            <br></br>
            <br></br>

            <div className="row row-cols-1 row-cols-md-2 g-4" >
                {data.filter((i) => ((i.fromloc.toLowerCase().includes(searchfrom.toLocaleLowerCase()))
                    && (i.toloc.toLowerCase().includes(searchto.toLocaleLowerCase()))
                    && (i.vtype.toLowerCase().includes(searchvtype.toLocaleLowerCase()))
                ))
                    .map(i => {
                        return (
                            <div className='col'>
                                <div className="card "
                                    style={{ padding: '10px', width: '650px' }}>
                                    <div className="card-body">
                                        <div className='cardb'>
                                            <div className='cardb'>
                                                <h3 className="card-title">{i.fromloc} - {i.toloc} <span style={{ fontSize: '20px' }}>({i.vtype})</span> </h3>
                                            </div>
                                            <div>
                                                {
                                                    (!localStorage.getItem('authToken')) ?
                                                        <button className="btn m-3 btn-outline-dark">Log in first</button>
                                                        : <button className="btn m-3 btn-outline-dark"
                                                            onClick={() => joinpool(i._id, i.ownerId)}
                                                        >Join</button>
                                                }
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
                            </div>

                        )
                    })}
            </div>
        </div>
    )
}
