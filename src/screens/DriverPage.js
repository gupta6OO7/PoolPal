import React, { useState, useEffect } from 'react'

export default function DriverPage() {

    const [data, setdata] = useState([]);
    const [searchfrom, setsearchfrom] = useState('');
    const [searchvtype, setsearchvtype] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/getdriverdata', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setdata(data.data);
                console.log(data);
            })
    }, []);

    const bookCab = async (msgid) => {
        const response = await fetch('http://localhost:5000/api/bookdriver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: msgid })
        });
        const json = await response.json()
        if (!json.success) {
            alert('Failed to book');
        }
        else {
            alert('Contact mailId: ');
        }
    }

    return (
        <div style={{ padding: "100px" }}>
            <div className='cardb'>
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
                        placeholder='Vehicle Type'
                        className="form-control"
                        value={searchvtype}
                        onChange={(e) => { setsearchvtype(e.target.value) }}
                    ></input>
                </div>
            </div>
            <br></br>
            <br></br>
            <div className="row row-cols-1 row-cols-md-3 g-4" >
                {data.filter((i) => ((i.location.toLowerCase().includes(searchfrom.toLocaleLowerCase()))
                    && (i.vtype.toLowerCase().includes(searchvtype.toLocaleLowerCase()))
                ))
                    .map(i => {
                        return (
                            <div className='col'>
                                <div
                                    className="card "
                                    style={{ padding: '10px', width: '430px' }}>
                                    <div className="card-body">
                                        <div className='cardb'>
                                            <div className='cardb'><h3 className="card-title">{i.location} <span style={{ fontSize: '20px' }}>- {i.vtype}</span> </h3></div>
                                            <div>
                                                {
                                                    (!localStorage.getItem('authToken')) ?
                                                        <button
                                                            className="btn m-3 btn-outline-dark">Log in first</button>
                                                        : <button
                                                            className="btn m-3 btn-outline-dark" onClick={() => bookCab(i._id)}>Join</button>
                                                }
                                            </div>
                                        </div>

                                        <div className='cardb'>
                                            <div>Seats: {i.seats}</div>
                                            <div className='d-flex ms-auto'>Pal - {i.username}</div>
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
