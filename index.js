const express = require('express')
require('dotenv').config()
    // const cors = require('cors')
const { connectDatabase } = require('./controller/mongooseConnect')
const app = express()

// const path = require('path')

// API port
const PORT = process.env.PORT || 4000

// connect to database
connectDatabase()

// Allows express use req.body on the routes
app.use(express.json())
    // app.use(cors)

// Homme page
// app.use('/', express.static(path.join(__dirname, 'static')))
app.get('/', (req, res) => {
    return res.send(`Welcome to the Home route ... check the following routes
    /api/posts ... /api/news ... /api/users ... /api/auth/*
    `)
})

// if (process.env.NODE_ENV === "production") {

// }

// routes
const auth = require('./routes/auth/auth')
const Posts = require('./routes/posts/posts')
const users = require('./routes/users/users')
const uploads = require('./routes/uploads/index')

// referencing routes
app.use('/api/auth', auth)
app.use('/api/posts', Posts)
app.use('/api/users', users)
app.use('/api/uploads', uploads)

//
app.listen(PORT, () => {
    console.log(`Architecture Hub backend is running on port ${PORT}`)
})