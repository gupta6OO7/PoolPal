const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoDb = async() => {
    const uri = 'mongodb+srv://og:' + process.env.DB_PASSWORD + '@cluster0.g6omsii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    console.log(uri);
    await mongoose.connect(uri, async() => {
        console.log("connected");
    });
}

module.exports = mongoDb;