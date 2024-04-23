const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    usertype:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    chatids:{
        type: Array
    }
});

module.exports = mongoose.model('user', UserSchema)