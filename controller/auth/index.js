require('dotenv').config()
const bcrypt = require('bcrypt')
const Users = require('../../models/users/users')
const Auths = require('../../models/auth/auths')

//
const {
    loginValidation,
    signupValidation,
} = require('../../validation/auth/index')
const { assignUserToken } = require('../../middlewares/auth/assignUserToken')

// Get all comments
const allAuthUsers = async(req, res) => {
    try {
        const authUsers = await Auths.find()
        res.send(authUsers)
    } catch (error) {
        res.send(error)
    }
}

//
const login = async(req, res) => {
    // validate user
    const { value, error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user with that email exist in database
    const user = await Auths.findOne({ email: value.email })
    if (!user) return res.status(400).send('Invalid credentials')

    // destructure req.body
    const { password } = value

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    // assign token
    assignUserToken(user._id, res)
}

const signup = async(req, res) => {
        // validate user
        const { value, error } = signupValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        // check if user email is in database
        const emailExist = await Auths.findOne({ email: value.email })
        if (emailExist) return res.status(400).send('Email already exist')

        // check if username has been taken
        const usernameExist = await Auths.findOne({ username: value.username })
        if (usernameExist) return res.status(400).send('Username is not available')

        // value === req.body
        const { password, email, username } = value

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newAuthUser = new Auths({
            username: username,
            email: email,
            password: hashedPassword,
        })

        let user_id = ''

        try {
            const savedUser = await newAuthUser.save()
            user_id = savedUser._id

            const addUserToMainDB = new Users({
                user_id: savedUser._id,
                email: savedUser.email,
                profile_picture: req.body.profile_picture,
            })

            // add new user to the main user collection
            await addUserToMainDB.save()
        } catch (error) {
            return res.send(error)
        }

        // assign token
        assignUserToken(user_id, res)
    }
    //
const resetPassword = async(req, res) => {
    // validate user
    const { value, error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user with that email exist in database
    const user = await Auths.findOne({ email: value.email })
    if (!user) return res.status(400).send('Invalid credentials email/username')

    // destructure req.body
    const { password } = value

    // Check if users new password matches the previous one
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword)
        return res.status(400).send('Avoid using your previous password')

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
        // console.log(hashedPassword)

    const updatedPost = await Auths.updateOne({ _id: user._id }, {
        $set: {
            password: hashedPassword,
        },
    }, )

    // assign token
    assignUserToken(user._id, res)
}

//
const logout = async(req, res) => {
    // assign token
    assignUserToken('', res, true)
}

module.exports = { signup, login, resetPassword, logout, allAuthUsers }

/* "profile_picture": {
        "title": "Test image name",
        "cloudinay_id" : "test ij;kdkak",
        "avatar": "test avtar"
    } */