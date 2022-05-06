const Joi = require('joi')

//User-defined function to validate the user
const userValidation = (userData) => {
    const UserSchema = {
        firstName: Joi.string().min(4).max(256).optional(),
        lastName: Joi.string().min(4).max(256).optional(),
        age: Joi.number().min(10).max(1024).optional(),
        account_status: Joi.string().optional(),
    }

    const JoiSchema = Joi.object(UserSchema)

    return JoiSchema.validate(userData)
}

module.exports = { userValidation }