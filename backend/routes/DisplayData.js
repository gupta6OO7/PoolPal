const express = require('express');

const router = express.Router()

const PMsg = require('../models/PoolMsg')
const Status = require('../models/DriverStatus')

router.get('/getpoolmsg', async (req, res) => {
    try {
        const allpmsg = await PMsg.find({});
        res.send({ status: 'ok', data: allpmsg });
    }
    catch (error) {
        console.log(error);
    }
})

router.get('/getdriverdata', async (req, res) => {
    try {
        const drivers = await Status.find({availability: 'Idle'});
        res.send({ status: 'ok', data: drivers });
    }
    catch (error) {
        console.log(error);
    }
})

router.post('/bookdriver', async (req, res) => {
    try {
        Status.findOneAndUpdate({ _id: req.body.id }, {
            availability: 'Busy',
            location: '0',
            vtype: '0',
            seats: '0'
        }, (err)=>{
            if(err){
                console.log(err);
            }
        })
        res.json({ success: true});
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

module.exports = router; 