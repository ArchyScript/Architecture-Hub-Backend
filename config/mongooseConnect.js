const mongoose = require('mongoose')
require('dotenv').config()

// const connectDatabase = async () => {
//   mongoose.connect(
//     'mongodb+srv://ArchyScript:ArchyScript10@cluster0.unwxu.mongodb.net/ArchitectureHub?retryWrites=true&w=majority',
//     () => {
//       console.log('connected to database')
//     },
//   )
// }

const connectDatabase = async () => {
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING, () => {
    console.log('connected to database')
  })
}

module.exports = { connectDatabase }
