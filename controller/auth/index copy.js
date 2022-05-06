// require('dotenv').config()
// const JWT = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const Auth = require('../../models/auth/Auth')
// const {
//     loginValidation,
//     signupValidation,
// } = require('../../validation/auth/index')
// const SECRET_KEY = process.env.jwt_token_secret_key

// //
// const allUsers = async(req, res) => {
//     try {
//         const allAuthUsers = await Auth.find()
//         res.send(allAuthUsers)
//     } catch (error) {
//         res.send(error)
//     }
// }

// const login = async(req, res) => {
//     const { value, error } = loginValidation(req.body)
//     if (error) return res.status(400).send(error)

//     const { password, email } = value
//     try {
//         const allAuthUsers = await Auth.find()
//         res.send(allAuthUsers)
//     } catch (error) {
//         res.send(error)
//     }

//     //     // Validate if users has account and return the users email
//     // const user = users.find((user) => {
//     //         return user.email === email
//     //     })
//     // check if email is in users database
//     // if (!user) {
//     //     return res.status(400).json({
//     //         errors: [{
//     //             msg: 'User does not exist',
//     //         }, ],
//     //     })
//     // }
//     //
//     // const passwordIsMatch = await bcrypt.compare(password, user.password)
//     //     // res.send(passwordIsMatch)
//     //     // use a generic messgae like invaid credentials
//     // if (!passwordIsMatch) {
//     //     return res.status(400).json({
//     //         errors: [{
//     //             msg: 'Invalid pasword',
//     //         }, ],
//     //     })
//     // }
//     // //
//     // const token = await JWT.sign({
//     //         email,
//     //     },
//     //     SECRET_KEY, {
//     //         expiresIn: 3900000,
//     //     },
//     // )
//     // res.json({ token })

//     // Validated user account
//     // assigns the users request to the constant value of 'error' and validates each respective data provided by the user
//     // const errors = validationResult(req)

//     // if error is found
//     // if (!errors.isEmpty()) {
//     //     return res.status(400).json({
//     //         errors: errors.array(),
//     //     })
//     // }

//     // Hash password
//     // let hashedPassword = await bcrypt.hash(password, 10)

//     // users.push({
//     //     email: email,
//     //     password: hashedPassword,
//     // })

//     // const token = await JWT.sign({
//     //         email,
//     //     },
//     //     SECRET_KEY, {
//     //         expiresIn: 3900000,
//     //     },
//     // )

//     // res.send(password)
//     // res.json({ token })
//     // res.send('User signup')
// }

// const signup = async(req, res) => {
//     // validate user
//     const { value, error } = signupValidation(req.body)
//     if (error) return res.status(400).send(error.details[0].message)

//     // check if user email is in database
//     const emailExist = await Auth.findOne({ email: value.email })
//     if (emailExist) return res.status(400).send('Email already exist')

//     // value === req.body
//     const { password, email } = value

//     // Hash password
//     const salt = await bcrypt.genSalt(15)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const newUser = new Auth({
//         email: email,
//         password: hashedPassword,
//     })

//     try {
//         const savedUser = await newUser.save()
//         res.send({ savedUserId: savedUser._id })
//     } catch (error) {
//         res.send(error)
//     }

//     const token = await JWT.sign({
//             email,
//         },
//         SECRET_KEY, {
//             expiresIn: 3900000,
//         },
//     )
//     res.send({ token })

//     // const { password, email } = req.body
//     //     // Validated user account
//     //     // assigns the users request to the constant value of 'error' and validates each respective data provided by the user
//     // const errors = validationResult(req)
//     //     // if error is found
//     // if (!errors.isEmpty()) {
//     //     return res.status(400).json({
//     //         errors: errors.array(),
//     //     })
//     // }
//     // // Validate if user already exist and return the users email
//     // const user = users.find((user) => {
//     //         // CHECKS IF USER EMAIL  ALREADY EXIST, REURN UNDEFINED IF YES AND THE USER'S EMAIL IF NO
//     //         return user.email === email
//     //     })
//     //     // check if email is not in users database
//     // if (user) {
//     //     return res.status(400).json({
//     //         errors: [{
//     //             msg: 'User already exist',
//     //         }, ],
//     //     })
//     // }

//     // // Hash password
//     // let hashedPassword = await bcrypt.hash(password, 10)
//     // users.push({
//     //     email: email,
//     //     password: hashedPassword,
//     // })
//     // const token = await JWT.sign({
//     //         email,
//     //     },
//     //     SECRET_KEY, {
//     //         expiresIn: 3900000,
//     //     },
//     // )
//     // res.json({ token })
// }

// // const validateCredentials = [
// //     check('email', 'Please, provide a valid email').isEmail(),
// //     check('password', 'Please provide a valid passwowrd').isLength({
// //         min: 6,
// //         max: 50,
// //     }),
// // ]

// // router.post('/signup', validateCredentials, signup)
// // router.post('/login', validateCredentials, login)

// module.exports = { allUsers, signup, login }