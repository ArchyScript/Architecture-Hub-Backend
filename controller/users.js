require('dotenv').config()
const cloudinary = require('../config/cloudinary')
const Users = require('../models/Users')

const { userValidation } = require('../validation/users')

// all users
const allUsers = async (req, res) => {
  try {
    const users = await Users.find()
    res.send(users)
  } catch (error) {
    res.send(error)
  }
}

// get specific  user by _id
const specificUserById = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findById({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const {
      password,
      lowercase_email,
      lowercase_username,
      ...other_details
    } = user._doc

    res.send(other_details)
  } catch (error) {
    res.send(error)
  }
}

// get specific  user by username
const specificUserByUsername = async (req, res) => {
  const { username } = req.params
  try {
    const user = await Users.findOne({ username })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const {
      password,
      lowercase_email,
      lowercase_username,
      ...other_details
    } = user._doc

    res.send(other_details)
  } catch (error) {
    res.send(error)
  }
}

// update user account
const updateUserAccount = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findById({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // validate user request
    const { value, error } = userValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { bio } = value

    await Users.updateOne(
      { _id },
      {
        $set: {
          bio,
        },
      },
    )

    res.send('Updated successfully')
  } catch (error) {
    res.send(error)
  }
}

// delete user account
const deleteUserAccount = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findOne({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    if (user.profile_picture.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(user.profile_picture.cloudinary_id)
    }

    // delete user from database
    await Users.deleteOne({ _id })

    res.status(200).send('Account has been successfully deleted')
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allUsers,
  specificUserById,
  specificUserByUsername,
  updateUserAccount,
  deleteUserAccount,
}
