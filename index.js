const express = require('express')
const { connectDatabase } = require('./config/mongooseConnect')
const app = express()
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// API port
const PORT = process.env.PORT || 4000

// connect to databaseconst connectDatabase = async() => {
// const connectDatabase = () => {
// mongoose.connect(process.env.mongodbConnectionString, () => {
//   console.log('connected to database')
// })
// }
connectDatabase()

// Allows express use req.body on the routes
app.use(express.json())
app.use(cors())

// Homme page
app.use('/', express.static(path.join(__dirname, 'static')))

// routes
const auth = require('./routes/auth')
const Posts = require('./routes/posts')
const users = require('./routes/users')
const news = require('./routes/news')
const comments = require('./routes/reactions.comments')
const likes = require('./routes/reactions.likes')

// referencing routes
app.use('/v1/api/auth', auth)
app.use('/v1/api/posts', Posts)
app.use('/v1/api/users', users)
app.use('/v1/api/news', news)
app.use('/v1/api/reactions/comments', comments)
app.use('/v1/api/reactions/likes', likes)

//
app.listen(PORT, () => {
  console.log(`Architecture Hub backend is running on port ${PORT}`)
})
