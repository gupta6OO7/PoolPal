const express = require('express');

const router = express.Router()

const Chat = require('../models/Chats')
const User = require('../models/Users');
const PMsg = require('../models/PoolMsg');


router.get('/getpoolmsg', async (req, res) => {
    try {
        const allpmsg = await PMsg.find({});
        res.send({ status: 'ok', data: allpmsg });
    }
    catch (error) {
        console.log(error);
    }
})

router.post('/deletepmsg', async (req, res) => {
    try {
        let pmsg = await PMsg.findById(req.body.poolId);

        for (let i = 0; i < pmsg.chatids.length; i++) {

            let mychat = await Chat.findById(pmsg.chatids[i]);

            await User.updateOne(
                { _id: mychat.ownerid }, 
                { $pullAll: { chatids: [pmsg.chatids[i]]} }
            );

            await User.updateOne(
                { _id: mychat.requestorid }, 
                { $pullAll: { chatids: [pmsg.chatids[i]]} }
            );

            await Chat.findByIdAndDelete(pmsg.chatids[i]);
        }

        await PMsg.findByIdAndDelete(req.body.poolId);

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/editpmsg', async (req, res) => {
    try {

        await PMsg.findByIdAndUpdate(req.body.poolId, {
            fromloc: req.body.fromloc,
            toloc: req.body.toloc,
            vtype: req.body.vtype,
            deptime: req.body.deptime,
            depdate: req.body.depdate,
            totalseats: req.body.totalseats,
            seatsleft: req.body.seatsleft
        })

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/createpmsg', async (req, res) => {
    try {
        let ts = Number(req.body.totalseats);
        let sl = Number(req.body.seatsleft);

        if (ts <= sl || ts <= 1 || sl <= 0) {
            return res.status(400).json({ errors: 'Try logging with correct credentials' });
        }

        await PMsg.create({
            fromloc: req.body.fromloc,
            toloc: req.body.toloc,
            vtype: req.body.vtype,
            deptime: req.body.deptime,
            depdate: req.body.depdate,
            totalseats: req.body.totalseats,
            seatsleft: req.body.seatsleft,
            username: req.body.username,
            ownerId: req.body.ownerId
        })

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

module.exports = router; 