require('dotenv').config()
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt')
const Users = require('../models/Users')

const { userBioValidation, userAuthValidation } = require('../validation/users')

// all users
const allUsers = async (req, res) => {
  try {
    const users = await Users.find()

    // to reset users default followers
    // users.forEach(async (user) => {
    //   const { _id } = user
    //   console.log(_id)
    //   const update = await Users.updateOne(
    //     { _id },
    //     {
    //       $set: {
    //         followings: [],
    //         followers: [],
    //       },
    //     },
    //   )
    //   console.log(update)
    //   console.log(users.length)
    // })

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
const updateUserBioAccount = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findById({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // validate user request
    const { value, error } = userBioValidation(req.body)
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

    res.send(`Yeeh! "@${user.username}", you just updated your bio`)
  } catch (error) {
    res.send(error)
  }
}

// update user auth info account (email, username)
const updateUserAuthInfo = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findById({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // validate user request
    const { value, error } = userAuthValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { username, email, password } = value

    // check validity of update params
    if (
      email.toLowerCase() === user.lowercase_email &&
      username.toLowerCase() === user.lowercase_username
    )
      return res.status(400).send('Nothing to update')

    // check validity of password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    // check if new email available
    if (email.toLowerCase() !== user.lowercase_email) {
      const emailExist = await Users.findOne({
        lowercase_email: email.toLowerCase(),
      })
      if (emailExist) return res.status(400).send('Email already exist')
    }

    // check if new username available
    if (username.toLowerCase() !== user.lowercase_username) {
      const usernameExist = await Users.findOne({
        lowercase_username: username.toLowerCase(),
      })
      if (usernameExist)
        return res.status(400).send('Username is not available')
    }

    const lowercase_username = username.toLowerCase()
    const lowercase_email = email.toLowerCase()

    await Users.updateOne(
      { _id },
      {
        $set: {
          username,
          email,
          lowercase_email,
          lowercase_username,
        },
      },
    )

    res.send(`Yeeh! "@${user.username}", you just updated your auth info`)
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

    // delete competitions, posts and scholarships
    // delete likes and posts related to each posts, competitions and scholarships

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
  updateUserAuthInfo,
  updateUserBioAccount,
  deleteUserAccount,
}
