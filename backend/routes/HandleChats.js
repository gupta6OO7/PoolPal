const express = require('express');

const router = express.Router()

const Chat = require('../models/Chats')
const User = require('../models/Users');
const Poolmsg = require('../models/PoolMsg');

// Status:
// 0 -> Send request
// 1 -> Request sent and waiting for owner to accept it
// 2 -> Request accepted

router.post('/createchatroom', async (req, res) => {
    try {
        let requestor = await User.findOne({ email: req.body.req_mailid });
        let owner = await User.findOne({ email: req.body.owner_mailid });

        let checkIt = await Chat.findOne({ 
            ownerid: owner._id,
            requestorid: requestor._id,
            pmsgid: req.body.pmsg_id 
        });

        if(checkIt){
            return res.status(400).json({ errors: 'Chat has already been created.' });
        }

        await Chat.create({
            ownerid: owner._id,
            requestorid: requestor._id,
            pmsgid: req.body.pmsg_id,
            chatmsg: [{ sender: "system", message: "Chatroom created"}],
            status: "0"
        })

        let mychat = await Chat.findOne({ 
            ownerid: owner._id,
            requestorid: requestor._id,
            pmsgid: req.body.pmsg_id 
        });

        await User.updateOne(
            { _id: owner._id }, 
            { $push: { chatids: mychat._id } }
        );

        await User.updateOne(
            { _id: requestor._id }, 
            { $push: { chatids: mychat._id } }
        );

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

        let finalStatus = '0';

        if(chatData.status === "0"){
            finalStatus = '1';
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
            finalStatus = '2';
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

        res.json({ success: true , status: finalStatus});
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

router.post('/getuserchatrooms', async (req, res) => {
    try {
        let userdata = await User.findOne({ email: req.body.email });
        let chatids = userdata.chatids;
        let chatrooms = [];
        for(let i=0; i<chatids.length; i++){
            let chatdata = await Chat.findOne({ _id: chatids[i] });
            let pooldata = await Poolmsg.findOne({ _id: chatdata.pmsgid });
            let reqdata = await User.findOne({ _id: chatdata.requestorid });
            let ownerdata = await User.findOne({ _id: chatdata.ownerid });
            if(userdata.name === reqdata.name) {
                chatrooms.push({
                    mailid: reqdata.email,
                    chatid: chatids[i],
                    username: ownerdata.name,
                    fromloc: pooldata.fromloc,
                    toloc: pooldata.toloc,
                    vtype: pooldata.vtype,
                    depdate: pooldata.depdate
                });
                continue;
            }
            chatrooms.push({
                mailid: reqdata.email,
                chatid: chatids[i],
                username: reqdata.name,
                fromloc: pooldata.fromloc,
                toloc: pooldata.toloc,
                vtype: pooldata.vtype,
                depdate: pooldata.depdate
            });
        }
        res.send({ success: true, chatrooms: chatrooms });
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router; 