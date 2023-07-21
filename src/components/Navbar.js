import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {

    let navigate = useNavigate();

    const handlelogout = () => {
        console.log(localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');
        
        navigate('/login');
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link style={{ color: 'white' }} className="navbar-brand fs-2" to="/">PoolPal</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {
                            (!localStorage.getItem('authToken')) ?
                                <div className="navbar-nav d-flex ms-auto">
                                    <Link style={{ color: 'white' }} className="nav-link fs-5" to="/login">Login</Link>
                                    <Link style={{ color: 'white' }} className="nav-link fs-5" to="/signup">Signup</Link>
                                </div>
                                : <div className="navbar-nav d-flex ms-auto">
                                    <div className='btn mx-2 fs-5' style={{ backgroundColor: 'black', color: 'white' }} onClick={handlelogout} >Logout</div>
                                </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}
