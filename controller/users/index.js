require('dotenv').config()
    // const JWT = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const User = require('../../models/users/Users')
const { userValidation } = require('../../validation/users/index')

const allUsers = async(req, res) => {
    // console.log('test')
    // res.send('test')
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.send(error)
    }
}

// get specific  user
const specificUser = async(req, res) => {
    // get user_id
    const user_id = req.params.user_id

    // check if user with that email exist in database
    const user = await User.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    try {
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

// update user account
const updateUserAccount = async(req, res) => {
    // get user_id
    const user_id = req.params.user_id

    // check if user with that email exist in database
    const user = await User.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const { value, error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const updatedUser = await User.updateOne({ _id: user_id }, {
            $set: {
                firstName: value.firstName,
                lastName: value.lastName,
                age: value.age,
                account_status: value.account_status,
            },
        }, )

        res.send(updatedUser)
    } catch (error) {
        res.send(error)
    }
}

// delete user account
const deleteUserAccount = async(req, res) => {
    // get user_id
    const user_id = req.params.user_id

    // check if user with that id exist in database
    const user = await User.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')
    console.log('tests')

    try {
        const deletedUser = await User.deleteOne({ _id: user_id })
        res.send(deletedUser)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    allUsers,
    specificUser,
    updateUserAccount,
    deleteUserAccount,
}