require('dotenv').config()
const bcrypt = require('bcrypt')
const Users = require('../../models/users/Users')
const Auth = require('../../models/users/Users')

//
const {
  loginValidation,
  signupValidation,
} = require('../../validation/auth/index')
const { assignUserToken } = require('../../middlewares/auth/assignUserToken')

//
const login = async (req, res) => {
  // validate user
  const { value, error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if user with that email exist in database
  const user = await Auth.findOne({ email: value.email })
  if (!user) return res.status(400).send('Invalid credentials')

  // destructure req.body
  const { password } = value

  // check if password is correct
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return res.status(400).send('Invalid credentials')

  // assign token
  assignUserToken(user._id, res)
}

const signup = async (req, res) => {
  // validate user
  const { value, error } = signupValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if user email is in database
  // const emailExist = await Auth.findOne({ email: req.body.email })
  const emailExist = await Auth.findOne({ email: value.email })
  // const emailExist = await Users.findOne({ email: value.email })
  if (emailExist) return res.status(400).send('Email already exist')

  // check if username has been taken
  const usernameExist = await Auth.findOne({ username: value.username })
  // const usernameExist = await Users.findOne({ username: value.username })
  if (usernameExist) return res.status(400).send('Username is not available')

  // value === req.body
  const { password, email, username } = value

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newAuthUser = new Auth({
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
const resetPassword = async (req, res) => {
  // validate user
  const { value, error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if user with that email exist in database
  const user = await Auth.findOne({ email: value.email })
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

  const updatedPost = await Auth.updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
      },
    },
  )

  // assign token
  assignUserToken(user._id, res)
}

//
const logout = async (req, res) => {
  // check if password is correct
  // const validPassword = await bcrypt.compare(password, user.password)
  // if (!validPassword) return res.status(400).send('Invalid credentials')

  // assign token
  assignUserToken('', res, true)
  // res.send('ljf;;')
}

module.exports = { signup, login, resetPassword, logout }

/* "profile_picture": {
        "title": "Test image name",
        "cloudinay_id" : "test ij;kdkak",
        "avatar": "test avtar"
    } */
