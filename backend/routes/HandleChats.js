const express = require('express');

const router = express.Router()

const Chat = require('../models/Chats')
const User = require('../models/Users');

// Status:
// 0 -> Send request
// 1 -> Request sent and waiting for owner to accept it
// 2 -> Request accepted

router.post('/createchatroom', async (req, res) => {
    try {
        let requestor = await User.findOne({ email: req.body.req_mailid });
        let owner = await User.findOne({ email: req.body.owner_mailid });

        await Chat.create({
            ownerid: owner._id,
            requestorid: requestor._id,
            pmsgid: req.body.pmsg_id,
            chatmsg: [{ sender: "system", message: "Chatroom created"}],
            status: "0"
        })

        res.json({ success: true, status: "0" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/sendmessage', async (req, res) => {
    try {
        await Chat.updateOne(
            { _id: req.body.chat_id }, 
            { $push: { chatmsg: { sender: req.body.sender_mailid, message: req.body.message }} }
        );

        res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/updatestatus', async (req, res) => {
    try {
        let chatData = await Chat.findOne({ _id: req.body.chat_id });

        if(chatData.status === "0"){
            await Chat.updateOne(
                { _id: req.body.chat_id }, 
                { $push: { chatmsg: { sender: "system", message: "Pool request has been sent" }} }
            );
            Chat.findOneAndUpdate({ _id: req.body.chat_id }, {
                status: '1'
            }, (err)=>{
                if(err){
                    console.log(err);
                }
            })
        }

        else if(chatData.status === "1"){
            await Chat.updateOne(
                { _id: req.body.chat_id }, 
                { $push: { chatmsg: { sender: "system", message: "Pool request has been accepted" }} }
            );
            Chat.findOneAndUpdate({ _id: req.body.chat_id }, {
                status: '2'
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

router.post('/getchat', async (req, res) => {
    try {
        let chatData = await Chat.findOne({ _id: req.body.chat_id });
        res.send({ status: 'ok', msgdata: chatData.chatmsg, status: chatData.status});
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router; 