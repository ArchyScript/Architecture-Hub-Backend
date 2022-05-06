const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('Auths', AuthSchema)