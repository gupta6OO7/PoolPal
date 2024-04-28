const express = require('express');
const router = express.Router()

const Status = require('../models/DriverStatus')

router.get('/getdriverdata', async (req, res) => {
    try {
        const drivers = await Status.find({availability: 'Idle'});
        res.send({ status: 'ok', data: drivers });
    }
    catch (error) {
        console.log(error);
    }
})

router.post('/statusUpdate', async (req, res) => {
    try {

        if(req.body.availability === 'Busy'){
            Status.findOneAndUpdate({ driverId: req.body.driverId }, {
                availability: 'Busy',
                date: req.body.depdate
            }, (err)=>{
                if(err){
                    console.log(err);
                }
            })
        }
        
        else{
            Status.findOneAndUpdate({ driverId: req.body.driverId }, {
                availability: 'Idle',
                location: req.body.location,
                vtype: req.body.vtype,
                seats: req.body.seats
            }, (err)=>{
                if(err){
                    console.log(err);
                }
            })
        }

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

module.exports = router; 