const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 256,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 256,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    date_joined: {
        type: Date,
        default: Date.now(),
    },
    date_of_birth: {
        type: Date,
    },
    account_status: {
        type: String,
    },
})

module.exports = mongoose.model('Users', UserSchema)