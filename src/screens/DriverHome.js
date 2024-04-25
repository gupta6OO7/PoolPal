import React from 'react'
import Navbar from '../components/Navbar'
import bgim1 from './bgim/ok11.gif'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function DriverHome() {
    return (
        <div>
            <Navbar></Navbar>
            <div
                className="jumbotron jumbotron-fluid jumbo1"
                style={{
                    backgroundImage: `url(${bgim1})`,
                    backgroundSize: 'cover',
                    textAlign: 'center'
                }}>
                <div
                    className="container"
                    style={{ textAlign: 'left' }}>
                    <h1 className="display-4">Update Status</h1>
                    <p className="lead">Increase your profits and give yourself a competitive edge without spending any money!</p>
                    {
                        (!localStorage.getItem('authToken')) ?
                            <Link style={{ color: 'white' }} to='/login'><button
                                type="button"
                                className="btn"
                                style={{ backgroundColor: 'black' }}>Change</button></Link>
                            : <Link style={{ color: 'white' }} to='/dstatus'><button
                                type="button"
                                className="btn"
                                style={{ backgroundColor: 'black' }}>Change</button></Link>
                    }

                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}
