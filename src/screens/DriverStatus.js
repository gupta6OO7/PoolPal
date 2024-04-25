import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DriverStatus() {

  let navigate = useNavigate();

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
    }
    authorize();
  }, [])

  const [creds, setcreds] = useState({
    availability: "Busy",
    location: "",
    vtype: "",
    seats: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/statusUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        availability: creds.availability,
        location: creds.location,
        vtype: creds.vtype,
        seats: creds.seats,
        driverId: userId
      })
    });
    const json = await response.json()
    if (!json.success) {
      alert(json.errors);
    }
    else {
      navigate('/dhome');
    }
  }

  const onChange = (event) => {
    setcreds({ ...creds, [event.target.name]: event.target.value })
  }

  return (
    <div>
      <form style={{
        paddingTop: '120px',
        paddingLeft: '500px',
        paddingRight: '500px'
      }} onSubmit={handleSubmit} >

        <div className="form-group">
          <label htmlFor="availability">Status</label>
          <select
            class="form-control"
            id="availability"
            name='availability'
            value={creds.availability}
            onChange={onChange}>
            <option>Busy</option>
            <option>Idle</option>
          </select>
        </div>

        {
          (creds.availability === 'Idle') ?
            <div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="Your current location"
                  name='location'
                  value={creds.location}
                  onChange={onChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="seats">Seats</label>
                <input
                  type="number"
                  className="form-control"
                  id="seats"
                  aria-describedby="seatsHelp"
                  name='seats'
                  value={creds.seats}
                  onChange={onChange}></input>
                <small id="seatsHelp"
                  className="form-text text-muted">This inludes driver's seat.</small>
              </div>

              <div className="form-group">
                <label htmlFor="vtype">Vehicle Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="vtype"
                  placeholder="Enter vehicle type"
                  name='vtype'
                  value={creds.vtype}
                  onChange={onChange}></input>
              </div>
            </div>
            : ''
        }
        {
          (!localStorage.getItem('authToken')) ?
            <button className="btn m-3 btn-primary">Log in first</button>
            : <button type="submit" className="btn m-3 btn-primary">Submit</button>
        }
      </form>
    </div>
  )
}