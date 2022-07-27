require('dotenv').config()
const bcrypt = require('bcrypt')
const Users = require('../models/Users')

//
const {
  loginWithEmailValidation,
  loginWithUsernameValidation,
  signupValidation,
  resetPasswordValidation,
  changePasswordValidation,
} = require('../validation/auth')
const { assignUserToken } = require('../middlewares/assignUserToken')

//
const loginWithEmail = async (req, res) => {
  try {
    // validate user
    const { value, error } = loginWithEmailValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { email, password } = value

    // checks if email exist (case-insensitive)
    const user = await Users.findOne({
      lowercase_email: email.toLowerCase(),
    })
    if (!user) return res.status(400).send('Invalid credentials')

    // checks if email exist (case-sensitive)
    // const user = await Users.findOne({ email })
    // if (!user) return res.status(400).send('Invalid credentials')

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    assignUserToken(user._id, res)
  } catch (error) {
    res.send(error)
  }
}

//
const loginWithUsername = async (req, res) => {
  try {
    // validate user
    const { value, error } = loginWithUsernameValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { username, password } = value

    // checks if username exist (case-sensitive)
    const user = await Users.findOne({ username })
    if (!user) return res.status(400).send('Invalid credentials')

    // checks if username exist (case-insensitive)
    // const user = await Users.findOne({
    //   lowercase_username: username.toLowerCase(),
    // })
    // if (!user) return res.status(400).send('Invalid credentials')

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).send('Invalid credentials')

    assignUserToken(user._id, res)
  } catch (error) {
    res.send(error)
  }
}

//
const signup = async (req, res) => {
  try {
    // validate user
    const { value, error } = signupValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // destructure request
    const { email, username, password, confirm_password } = value

    // check if password matches confirm_password
    if (password !== confirm_password)
      return res.status(400).send('Password must match')

    // check if user email is in database (case-insensitive)
    const emailExist = await Users.findOne({
      lowercase_email: email.toLowerCase(),
    })
    if (emailExist) return res.status(400).send('Email already exist')

    // checks if username exist (case-insensitive)
    const usernameExist = await Users.findOne({
      lowercase_username: username.toLowerCase(),
    })
    if (usernameExist) return res.status(400).send('Username is not available')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const lowercase_email = email.toLowerCase()
    const lowercase_username = username.toLowerCase()

    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      lowercase_email,
      lowercase_username,
    })

    const savedUser = await newUser.save()
    const user_id = savedUser._id

    // assign token
    assignUserToken(user_id, res)
  } catch (error) {
    res.send(error)
  }
}

//
const resetPassword = async (req, res) => {
  try {
    const { value, error } = resetPasswordValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // const { _id } = req.params
    const { email, username, new_password, confirm_new_password } = value

    if (new_password !== confirm_new_password)
      return res.status(400).send('passwords must match')

    // checks if user exist (case-insensitive)
    const user = await Users.findOne({ username })
    if (!user) return res.status(400).send('invalid credentials')

    if (user.lowercase_email !== email.toLowerCase())
      return res.status(400).send('email does not match')

    const { _id } = user

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_password, salt)

    await Users.updateOne(
      { _id },
      {
        $set: {
          password: hashedPassword,
        },
      },
    )

    // assign token
    assignUserToken(_id, res)
  } catch (error) {
    return res.send(error)
  }
}

//
const changePassword = async (req, res) => {
  try {
    const { value, error } = changePasswordValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // const { _id } = req.params
    const {
      email,
      username,
      old_password,
      new_password,
      confirm_new_password,
    } = value

    if (new_password !== confirm_new_password)
      return res.status(400).send('New password must match')

    // checks if user exist (case-insensitive)
    const user = await Users.findOne({ username })
    if (!user) return res.status(400).send('invalid credentials')

    if (user.lowercase_email !== email.toLowerCase())
      return res.status(400).send('User email does not match')

    const { _id } = user

    // checks if email exist (case-insensitive)
    // const user = await Users.findOne({
    //   lowercase_email: email.toLowerCase(),
    // })

    // Check if user password is valid
    const validPassword = await bcrypt.compare(old_password, user.password)
    if (!validPassword) return res.status(400).send('')

    // Check if users new password matches the previous one
    if (old_password === new_password)
      return res
        .status(400)
        .send('Use a password different from your previous one')

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_password, salt)

    await Users.updateOne(
      { _id },
      {
        $set: {
          password: hashedPassword,
        },
      },
    )

    // assign token
    assignUserToken(_id, res)
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
  loginWithEmail,
  loginWithUsername,
  resetPassword,
  logout,
  changePassword,
}
