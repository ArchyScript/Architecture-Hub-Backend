const Joi = require('joi')

// login validation
const resetPasswordValidation = (data) => {
  const resetPasswordSchema = {
    email: Joi.string().min(6).max(256).required().email(),
    old_password: Joi.string().min(6).max(1024).required(),
    new_password: Joi.string().min(6).max(1024).required(),
    confirm_new_password: Joi.string().min(6).max(1024).required(),
  }

  const JoiSchema = Joi.object(resetPasswordSchema)
  return JoiSchema.validate(data)
}

// login with username validation
const loginWithUsernameValidation = (data) => {
  const LoginWithUsernameSchema = {
    username: Joi.string().min(4).max(256).required(),
    password: Joi.string().min(6).max(1024).required(),
  }

  const JoiSchema = Joi.object(LoginWithUsernameSchema)
  return JoiSchema.validate(data)
}

// login with email validation
const loginWithEmailValidation = (data) => {
  const LoginWithEmailSchema = {
    email: Joi.string().min(6).max(256).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  }

  const JoiSchema = Joi.object(LoginWithEmailSchema)
  return JoiSchema.validate(data)
}

// signup validation
const signupValidation = (data) => {
  const SignupSchema = {
    username: Joi.string().min(4).max(256).required(),
    email: Joi.string().min(6).max(256).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    confirm_password: Joi.string().min(6).max(1024).required(),
  }

  const JoiSchema = Joi.object(SignupSchema)
  return JoiSchema.validate(data)
}

module.exports = {
  resetPasswordValidation,
  loginWithEmailValidation,
  loginWithUsernameValidation,
  signupValidation,
}
