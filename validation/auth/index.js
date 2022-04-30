const Joi = require('joi')

// login validation
const loginValidation = (data) => {
    const LoginSchema = {
        email: Joi.string().min(6).max(256).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    }

    const JoiSchema = Joi.object(LoginSchema)
    return JoiSchema.validate(data)
}

// signup validation
const signupValidation = (data) => {
    const SignupSchema = {
        email: Joi.string().min(6).max(256).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    }

    const JoiSchema = Joi.object(SignupSchema)
    return JoiSchema.validate(data)
}

module.exports = { loginValidation, signupValidation }