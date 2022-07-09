require('dotenv').config()
const bcrypt = require('bcrypt')
const Users = require('../models/Users')
const Auths = require('../models/Auths')

//
const { loginValidation, signupValidation } = require('../validation/auth')
const { assignUserToken } = require('../middlewares/assignUserToken')

// Get all auth users
const allAuthUsers = async (req, res) => {
  try {
    const authUsers = await Auths.find()
    res.send(authUsers)
  } catch (error) {
    res.send(error)
  }
}

// get specific  user
const specificAuthUser = async (req, res) => {
  const _id = req.params._id

  // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
  const user = await Auths.findById({ _id })
  if (!user) return res.status(400).send('Cannot fetch data of invalid user')

  const { password, createdAt, ...others } = user._doc

  try {
    res.send(others)
  } catch (error) {
    res.send(error)
  }
}

//
const login = async (req, res) => {
  // const userToken = await req.headers['Content-Type']
  // console.log(req.headers)
  // console.log(userToken)

  try {
    // validate user
    const { value, error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user with that email exist in database
    const user = await Auths.findOne({ email: value.email })
    if (!user) return res.status(400).send('Invalid credentials')

    // destructure validated request
    const { password } = value

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    // assign token
    // res.send('success')

    assignUserToken(user._id, res)
  } catch (error) {
    // if (error)
    // return res.status(400).send('Invalid credentials')

    return res.send(error)
  }
}

//
const signup = async (req, res) => {
  try {
    // validate user
    const { value, error } = signupValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if user email is in database
    const emailExist = await Auths.findOne({ email: value.email })
    if (emailExist) return res.status(400).send('Email already exist')

    // check if username has been taken
    const usernameExist = await Auths.findOne({ username: value.username })
    if (usernameExist) return res.status(400).send('Username is not available')

    const { password, email, username, confirm_password } = value

    if (password !== confirm_password)
      return res.status(400).send('Password must match')

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
  } catch (error) {
    res.send(error)
  }
}

//
const resetPassword = async (req, res) => {
  try {
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

    const updatedPost = await Auths.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
    )

    // assign token
    assignUserToken(user._id, res)
  } catch (error) {
    return res.send(error)
  }
}

//
const logout = async (req, res) => {
  try {
    // assign token
    assignUserToken('', res, true)
  } catch (error) {
    return res.send(error)
  }
}

module.exports = {
  signup,
  login,
  specificAuthUser,
  resetPassword,
  logout,
  allAuthUsers,
}
