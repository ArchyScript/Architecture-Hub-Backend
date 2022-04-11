const express = require('express')
const router = express.Router()
    //     // import user database
const { publicPosts, privatePosts } = require('../db/db')

// Mideware for protected routes
const checkUserAuth = require('./midleware/checkUserAuth')

// const { check, validationResult } = require('express-validator')
// const bcrypt = require('bcrypt')
// const JWT = require('jsonwebtoken')

// public post
router.get('/public', (req, res) => {
    res.json({ publicPosts })
})

// const JWT = require('jsonwebtoken')
// const secretKey = 'ArchyScript@10'

// router.get('/private', (req, res) => {
//     res.json({ privatePosts })
// })

// router.get('/private', (req, res, next) => {
//     res.json({ privatePosts })
// })
// router.get(
//     '/private',
//     (req, res, next) => {
//         let userIsValid = true

//         // const userToken = await req.header('x-auth-token')

//         if (userIsValid) {
//             next()
//         } else {
//             return res.status(400).json({
//                 errors: [{
//                     msg: 'No token found',
//                 }, ],
//             })
//         }
//     },
//     (req, res) => {
//         res.json(privatePosts)
//     },
// )

// const checkUserAuth = async(req, res, next) => {
//     let userIsValid = false

//     const userToken = await req.header('x-auth-token')

//     if (!userToken) {
//         return res.json({
//             errors: [{
//                 msg: 'No token found',
//             }, ],
//         })
//     }

//     try {
//         const user = await JWT.verify(token, secretKey)
//         req.user = user.email
//         next()
//     } catch (error) {
//         return res.json({
//             errors: [{
//                 msg: 'Invalid token',
//             }, ],
//         })
//     }

//     // if (userIsValid) {
//     //     next()
//     // } else {
//     //     return res.json({
//     //         errors: [{
//     //             msg: 'Access denied',
//     //         }, ],
//     //     })
//     // }
// }

// private post
router.get('/private', checkUserAuth, (req, res) => {
    res.json({ privatePosts })
})

module.exports = router