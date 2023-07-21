const express = require('express');

const router = express.Router()

const PMsg = require('../models/PoolMsg')

router.post('/createpmsg', async (req, res) => {
    try {
        await PMsg.create({
            fromloc: req.body.fromloc,
            toloc: req.body.toloc,
            vtype: req.body.vtype,
            deptime: req.body.deptime,
            depdate: req.body.depdate,
            totalseats: req.body.totalseats,
            seatsleft: req.body.seatsleft,
            username: req.body.username,
            mailId: req.body.mailId
        })

        let ts = req.body.totalseats;
        let sl = req.body.seatsleft;

        if (ts <= sl || ts <= 1 || sl <= 0) {
            return res.status(400).json({ errors: 'Try logging with correct credentials' });
        }

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

module.exports = router; 