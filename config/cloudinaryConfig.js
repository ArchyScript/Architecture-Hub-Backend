// require('dotenv').config()
// const cloudinary = require('cloudinary')

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
//     secure: true,
// })

// exports.uploads = (file) => {
//     return new Promise((resolve) => {
//         cloudinary.uploader.upload(
//             file,
//             (result) => {
//                 resolve({ url: result.url, id: result.public_id })
//                 console.log(result)
//             }, { resource_type: 'auto' },
//         )
//     })
// }