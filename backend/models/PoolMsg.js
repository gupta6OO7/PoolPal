const mongoose = require('mongoose')

const { Schema } = mongoose;

const PMsgSchema = new Schema({
    fromloc:{
        type: String,
        required: true
    },
    toloc:{
        type: String,
        required: true
    },
    vtype:{
        type: String,
        required: true
    },
    deptime:{
        type: String,
        required: true
    },
    depdate:{
        type: String,
        required: true
    },
    totalseats:{
        type: Number,
        required: true
    },
    seatsleft:{
        type: Number,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    ownerId:{
        type: String,
        required: true
    },
    chatids:{
        type: Array
    }
});

module.exports = mongoose.model('pmsg', PMsgSchema)