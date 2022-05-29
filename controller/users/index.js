require('dotenv').config()
const bcrypt = require('bcrypt')
const Users = require('../../models/users/Users')
const { userValidation } = require('../../validation/users/index')

const allUsers = async(req, res) => {
    try {
        const users = await Users.find()
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
    const user = await Users.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    try {
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

// Create new post
const createPost = async(req, res) => {
    const { value, error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const newUser = new Users({
        title: req.body.title,
        content: req.body.content,
        no_of_likes: req.body.no_of_likes,
        no_of_comments: req.body.no_of_comments,
        people_engages_in_post: req.body.people_engages_in_post,
    })

    try {
        // if (!productTest)
        //     return res.status(400).send('Cannot fetch data of invalid product')
        // const productTest = await ProductTest.findOne({ _id: req.body.user_id })
        // const updatedPost = await ProductTest.updateOne({ _id: req.body.post_Id }, {
        //     $set: {
        //         name: 'req.body.title',
        //     },
        // }, )
        // if (!updatedPost.acknowledged) {
        //     return res.send('tetst')
        // }
        // const productTest = await ProductTest.findOne({ _id: req.body.user_id })
        // res.send(productTest)
        // if (user) return res.status(201).send('Users available')
        // const savedPost = await newUser.save()
        // console.log(newUser._id)
        // console.log(req.body)
        // const allProducts = await ProductTest.find()
        // res.send(allProducts)
    } catch (error) {
        res.send(error)
    }
}

// update user account
const updateUserAccount = async(req, res) => {
    // get user_id
    const user_id = req.params.user_id

    // check if user with that email exist in database
    const user = await Users.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const { value, error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const updatedUser = await Users.updateOne({ _id: user_id }, {
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
    const user = await Users.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')
    console.log('tests')

    try {
        const deletedUser = await Users.deleteOne({ _id: user_id })
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