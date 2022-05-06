require('dotenv').config()
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('../../models/users/Users')
const {
    loginValidation,
    signupValidation,
} = require('../../validation/auth/index')
const SECRET_KEY = process.env.jwt_token_secret_key

//
const login = async(req, res) => {
    // validate user
    const { value, error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user with that email exist in database
    const user = await Users.findOne({ email: value.email })
    if (!user) return res.status(400).send('Invalid credentials')

    // destructure req.body
    const { password } = value

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

    const user_id = user._id

    const token = await JWT.sign({
            user_id,
        },
        SECRET_KEY, {
            expiresIn: 3900000,
        },
    )

    const response = {
        savedUserId: user._id,
        token: token,
    }

    res.header('x-auth-token', token).send(response)
}

const signup = async(req, res) => {
    // validate user
    const { value, error } = signupValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user email is in database
    const emailExist = await Users.findOne({ email: value.email })
    if (emailExist) return res.status(400).send('Email already exist')

    // check if username has been taken
    const usernameExist = await Users.findOne({ username: value.username })
    if (usernameExist) return res.status(400).send('Username is not available')

    // value === req.body
    const { password, email, username } = value

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new Users({
        username: username,
        email: email,
        password: hashedPassword,
    })

    let user_id = ''

    try {
        const savedUser = await newUser.save()
        user_id = savedUser._id
    } catch (error) {
        res.send(error)
    }

    const token = await JWT.sign({
            user_id,
        },
        SECRET_KEY, {
            expiresIn: 3900000,
        },
    )

    const response = {
        user_id: user_id,
        token: token,
    }

    res.header('x-auth-token', token).send(response)
}

module.exports = { signup, login }