const express = require('express')
const { connectDatabase } = require('./config/mongooseConnect')
const app = express()
const path = require('path')
const cors = require('cors')

// Post Pagination

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config()
// }

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
const reactions = require('./routes/reactions')
const competitions = require('./routes/competitions')
const scholarships = require('./routes/scholarships')

// referencing routes
app.use('/api/auth', auth)
app.use('/api/posts', Posts)
app.use('/api/users', users)
app.use('/api/reactions', reactions)
app.use('/api/scholarships', scholarships)
app.use('/api/competitions', competitions)

//
app.listen(PORT, () => {
  console.log(`Architecture Hub backend is running on port ${PORT}`)
})
