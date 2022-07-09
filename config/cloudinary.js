const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'yungscript',
  api_key: process.env.API_KEY || '679758917131596',
  api_secret: process.env.API_SECRET || 'aTU81d3j4DCro9vwKQB97LQSx5U',
  secure: true,
})

module.exports = cloudinary
