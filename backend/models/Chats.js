const mongoose = require('mongoose')

const { Schema } = mongoose;

const ChatSchema = new Schema({
    ownerid:{
        type: String,
        required: true
    },
    requestorid:{
        type: String,
        required: true
    },
    pmsgid:{
        type: String,
        required: true
    },
    chatmsg:{
        type: Array
    },
    status:{
        type: String
    }
});

module.exports = mongoose.model('chat', ChatSchema)