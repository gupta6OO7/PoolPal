import React from 'react'
import Navbar from '../components/Navbar'
import DriverStatus from './DriverStatus'

export default function DriverHome() {
    return (
        <div>
            <Navbar></Navbar>
            <DriverStatus></DriverStatus>
        </div>
    )
}
