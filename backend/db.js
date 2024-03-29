const mongoose = require('mongoose');
require('dotenv').config();

const mongoDb = async() => {
    const uri = 'mongodb+srv://og:${process.env.DB_PASSWORD}@cluster0.g6omsii.mongodb.net/?retryWrites=true&w=majority';
    await mongoose.connect(uri, async() => {
        console.log("connected");
    });
}

module.exports = mongoDb;