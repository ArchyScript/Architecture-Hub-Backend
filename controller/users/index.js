require('dotenv').config()
const Users = require('../../models/users/users.js')
const Auths = require('../../models/auth/auths')

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
    // get user_id from the parameter passed in as a request
    const user_id = req.params.user_id

    // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
    const user = await Users.findOne({ user_id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    try {
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

// Create new post
// const createNewUser = async(req, res) => {
//     const { value, error } = userValidation(req.body)
//     if (error) return res.status(400).send(error.details[0].message)

//     const newUser = new Users({
//         title: req.body.title,
//         content: req.body.content,
//         no_of_likes: req.body.no_of_likes,
//         no_of_comments: req.body.no_of_comments,
//         people_engages_in_post: req.body.people_engages_in_post,
//     })

//     try {
//         // if (!productTest)
//         //     return res.status(400).send('Cannot fetch data of invalid product')
//         // const productTest = await ProductTest.findOne({ _id: req.body.user_id })
//         // const updatedPost = await ProductTest.updateOne({ _id: req.body.post_Id }, {
//         //     $set: {
//         //         name: 'req.body.title',
//         //     },
//         // }, )
//         // if (!updatedPost.acknowledged) {
//         //     return res.send('tetst')
//         // }
//         // const productTest = await ProductTest.findOne({ _id: req.body.user_id })
//         // res.send(productTest)
//         // if (user) return res.status(201).send('Users available')
//         // const savedPost = await newUser.save()
//         // console.log(newUser._id)
//         // console.log(req.body)
//         // const allProducts = await ProductTest.find()
//         // res.send(allProducts)
//     } catch (error) {
//         res.send(error)
//     }
// }

// update user account
const updateUserAccount = async(req, res) => {
    // get user_id from the parameter passed in as a request
    const user_id = req.params.user_id

    // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
    const user = await Users.findOne({ user_id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // validate user request
    const { value, error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        const updatedUser = await Users.updateOne({ user_id: user_id }, {
            $set: {
                bio: value.bio,
                profile_picture: value.profile_picture,
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
    const user = await Auths.findOne({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    try {
        // delete user from the auth database
        await Auths.deleteOne({ _id: user_id })

        // delete user from the user database
        await Users.deleteOne({ user_id: user_id })

        res.send('Account has been successfully deleted')
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