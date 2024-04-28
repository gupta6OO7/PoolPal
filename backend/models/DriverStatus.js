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
    driverId:{
        type: String,
        required: true
    },
    date:{
        type: String
    }
});

module.exports = mongoose.model('driverStatus', StatusSchema)