const express = require('express')
require('dotenv').config()
const { connectDatabase } = require('./config/mongooseConnect')
const app = express()
const path = require('path')
const cors = require('cors')

// API port
const PORT = process.env.PORT || 4000

// connect to database
connectDatabase()

// Allows express use req.body on the routes
app.use(express.json())
app.use(cors())

// Homme page
app.use('/', express.static(path.join(__dirname, 'static')))

// routes
const auth = require('./routes/auth/auth')
const Posts = require('./routes/posts/posts')
const users = require('./routes/users/users')
const news = require('./routes/news/news')
const uploads = require('./routes/uploads/index')
const comments = require('./routes/reactions/comments')
const likes = require('./routes/reactions/likes')

// const product_test = require('./routes/product-test')

// cloudinary test route
// const cloudinary_upload = require('./routes/profile')

// referencing routes
app.use('/api/auth', auth)
app.use('/api/posts', Posts)
app.use('/api/users', users)
app.use('/api/news', news)
app.use('/api/uploads', uploads)
app.use('/api/reactions/comments', comments)
app.use('/api/reactions/likes', likes)

// app.use('/api/product_test', product_test)

// test
// app.use('/api/cloudinary_upload/single', cloudinary_upload)

//
app.listen(PORT, () => {
    console.log(`Architecture Hub backend is running on port ${PORT}`)
})