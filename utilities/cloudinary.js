const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
})

module.exports = cloudinary

// CLOUD_NAME="yungscript"
// API_KEY="679758917131596"
// API_SECRET="aTU81d3j4DCro9vwKQB97LQSx5U"
// CLOUDINARY_URL=cloudinary://679758917131596:aTU81d3j4DCro9vwKQB97LQSx5U@yungscript