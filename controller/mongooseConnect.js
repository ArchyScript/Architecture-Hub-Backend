// import mongoose from 'mongoose'
const mongoose = require('mongoose')
require('dotenv').config()

export const connectDatabase = async() => {
    console.log(process.env.mongodbConnectionString)
    try {
        await mongoose.connect('mongodb://localhost:27017/test', {
            //   useNewUrlParser: true,
            //   useUnifiedTopology: true,
            //   useCreateIndex: true,
        })
    } catch (error) {
        console.log(error.message)
    }
}

// modules.export = connectDatabase