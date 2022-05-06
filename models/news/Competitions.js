const mongoose = require('mongoose')

const CompetitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    no_of_likes: {
        type: Number,
        default: 0,
    },
    no_of_comments: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('Competitions', CompetitionSchema)