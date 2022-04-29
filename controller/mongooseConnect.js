const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = async() => {
    mongoose.connect(process.env.mongodbConnectionString, () => {
        console.log('connected to database')
    })
}

module.exports = { connectDatabase }