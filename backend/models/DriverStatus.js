const mongoose = require('mongoose')

const { Schema } = mongoose;

const StatusSchema = new Schema({
    
    availability:{
        type: String,
        required: true
    },
    location:{
        type: String
    },
    vtype:{
        type: String
    },
    seats:{
        type: Number
    },
    username:{
        type: String,
        required: true
    },
    mailId:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('driverStatus', StatusSchema)