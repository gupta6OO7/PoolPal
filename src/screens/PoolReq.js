import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PoolReq() {

  let navigate = useNavigate();
  const [userName, setuserName] = useState('');
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
      setuserName(json.userName);
      setuserId(json.userId);
    }
    authorize();
  }, [])

  const [creds, setcreds] = useState({
    fromloc: "",
    toloc: "",
    vtype: "",
    deptime: "",
    depdate: "",
    totalseats: "",
    seatsleft: ""
  })

  const handleSubmit = async (e) => {

    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/createpmsg', {
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
        username: userName,
        ownerId: userId
      })
    });

    const json = await response.json()
    if (!json.success) {
      alert('Enter Valid Details');
    }
    else {
      navigate('/');
    }
  }

  const onChange = (event) => {
    setcreds({ ...creds, [event.target.name]: event.target.value })
  }

  return (
    <div>
      <form style={{
        paddingTop: '40px',
        paddingLeft: '500px',
        paddingRight: '500px'
      }} onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="name">From</label>
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
          <label htmlFor="name">To</label>
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
          <label htmlFor="name">Vehicle Type</label>
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
          <label htmlFor="name">Departure Time</label>
          <input
            type="time"
            className="form-control"
            id="time"
            name='deptime'
            value={creds.deptime}
            onChange={onChange}></input>
        </div>

        <div className="form-group">
          <label htmlFor="name">Departure Date</label>
          <input
            type="date"
            className="form-control"
            id="date" name='depdate'
            value={creds.depdate}
            onChange={onChange}></input>
        </div>

        <div className="form-group">
          <label htmlFor="name">Total Seats</label>
          <input
            type="number"
            className="form-control"
            id="ts"
            name='totalseats'
            value={creds.totalseats}
            onChange={onChange}></input>
        </div>

        <div className="form-group">
          <label htmlFor="name">Seats left</label>
          <input
            type="number"
            className="form-control"
            id="sl"
            name='seatsleft'
            value={creds.seatsleft}
            onChange={onChange}></input>
        </div>

        {
          (!localStorage.getItem('authToken')) ?
            <button className="btn m-3 btn-primary">Log in first</button>
            : <button type="submit" className="btn m-3 btn-primary">Submit</button>
        }

      </form>
    </div>
  )
}
