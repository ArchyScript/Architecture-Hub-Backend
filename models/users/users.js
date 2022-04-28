const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requiredd: true,
        unique: true,
    },
    password: {
        type: String,
        requiredd: true,
    },
}, { collection: 'users' })

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model