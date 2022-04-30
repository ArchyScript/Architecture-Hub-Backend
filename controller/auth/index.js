require('dotenv').config()
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Auth = require('../../models/auth/Auth')
const {
    loginValidation,
    signupValidation,
} = require('../../validation/auth/index')
const { valid } = require('joi')
const SECRET_KEY = process.env.jwt_token_secret_key

//
const allUsers = async(req, res) => {
    try {
        const allAuthUsers = await Auth.find()
        res.send(allAuthUsers)
    } catch (error) {
        res.send(error)
    }
}

const login = async(req, res) => {
    // validate user
    const { value, error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user with that email exist in database
    const user = await Auth.findOne({ email: value.email })
    if (!user) return res.status(400).send('Invalid credentials')

    // destructure req.body
    const { password, email } = value

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    // const token = await JWT.sign({
    //         _id: user._id,
    //     },
    //     SECRET_KEY, {
    //         expiresIn: 3900000,
    //     },
    // )

    const token = await JWT.sign({
            email,
        },
        SECRET_KEY, {
            expiresIn: 3900000,
        },
    )
    res.send({ token })
}

const signup = async(req, res) => {
    // validate user
    const { value, error } = signupValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user email is in database
    const emailExist = await Auth.findOne({ email: value.email })
    if (emailExist) return res.status(400).send('Email already exist')

    // value === req.body
    const { password, email } = value

    // Hash password
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new Auth({
        email: email,
        password: hashedPassword,
    })

    try {
        const savedUser = await newUser.save()
        res.send({ savedUserId: savedUser._id })
    } catch (error) {
        res.send(error)
    }

    // const token = await JWT.sign({
    //         _id: user._id,
    //     },
    //     SECRET_KEY, {
    //         expiresIn: 3900000,
    //     },
    // )
    const token = await JWT.sign({
            email,
        },
        SECRET_KEY, {
            expiresIn: 3900000,
        },
    )

    res.send({ token })
}

// const validateCredentials = [
//     check('email', 'Please, provide a valid email').isEmail(),
//     check('password', 'Please provide a valid passwowrd').isLength({
//         min: 6,
//         max: 50,
//     }),
// ]

module.exports = { allUsers, signup, login }