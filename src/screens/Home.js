import React from 'react'
import Navbar from '../components/Navbar'
import bgim1 from './bgim/ok11.gif'
import bgim2 from './bgim/PARIS.jpg'
import bgim3 from './bgim/Drive.png'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function Home() {
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
                    <h1 className="display-4">Find Participants</h1>
                    <p className="lead"
                    >Invite others to join you on your ride to help the environment and save money.</p>
                    {
                        (!localStorage.getItem('authToken')) ?
                            <Link to='/login'><button
                                type="button"
                                className="btn"
                                style={{
                                    color: 'white',
                                    backgroundColor: 'black'
                                }}>Create</button></Link>
                            : <Link
                                to='/poolreq'><button
                                    type="button"
                                    className="btn"
                                    style={{
                                        color: 'white',
                                        backgroundColor: 'black'
                                    }}>Create</button></Link>
                    }
                </div>
            </div>

            <div
                className="jumbotron jumbotron-fluid jumbo2"
                style={{
                    backgroundImage: `url(${bgim2})`,
                    backgroundSize: 'cover',
                    textAlign: 'center'
                }}>
                <div className="container" style={{ textAlign: 'left' }}>
                    <h1 className="display-4">Join a Pool</h1>
                    <p className="lead">Reach out to others who are interested in your participation</p>
                    {
                        (!localStorage.getItem('authToken')) ?
                            <Link to='/login'><button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#a95050',
                                    color: '#9dd8ed'
                                }}>PoolUp</button></Link>
                            : <Link to='/poolpage'><button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#a95050',
                                    color: '#9dd8ed'
                                }}>PoolUp</button></Link>
                    }
                </div>
            </div>

            <div
                className="jumbotron jumbotron-fluid jumbo3"
                style={{
                    backgroundImage: `url(${bgim3})`,
                    backgroundSize: 'cover',
                    textAlign: 'center'
                }}>
                <div className="container" style={{ textAlign: 'right' }}>
                    <h1 className="display-4">Book a Cab</h1>
                    <p className="lead">No more going out to search or visiting the cab service agents.</p>
                    {
                        (!localStorage.getItem('authToken')) ?
                            <Link to='/login'><button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#e7c1a1',
                                    color: 'black'
                                }}>Book</button></Link>
                            : <Link to='/dpage'><button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#e7c1a1',
                                    color: 'black'
                                }}>Book</button></Link>
                    }
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}
