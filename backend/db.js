const mongoose = require('mongoose');
const mongoDb = async() => {
    await mongoose.connect('mongodb+srv://og:21ucs140@cluster0.g6omsii.mongodb.net/?retryWrites=true&w=majority', async() => {
        console.log("connected");
    });
}

module.exports = mongoDb;