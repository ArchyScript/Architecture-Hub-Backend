const Joi = require('joi')

const bio = Joi.object({
    firstname: Joi.string().optional().min(2).max(1024).messages({
        'string.base': `"firstname" should be a "String"`,
        'string.empty': `"firstname" cannot be an empty field`,
        'string.min': `"firstname" should have a minimum length of {#limit}`,
        'string.max': `"firstname" should have a maximum length of {#limit}`,
    }),
    lastname: Joi.string().optional().min(2).max(1024).messages({
        'string.base': `"lastname" should be a "String"`,
        'string.empty': `"lastname" cannot be an empty field`,
        'string.min': `"lastname" should have a minimum length of {#limit}`,
        'string.max': `"lastname" should have a maximum length of {#limit}`,
    }),
    gender: Joi.string().messages({
        'string.base': `"gender" should be a "String"`,
        'string.empty': `"gender" cannot be an empty field`,
    }),
})

const profile_picture = Joi.object({
    title: Joi.string().optional().messages({
        'string.base': `"title" should be a "String"`,
        'string.empty': `"title" cannot be an empty field`,
    }),
    cloudinary_id: Joi.string().optional().messages({
        'string.base': `"cloudinary_id" should be a "String"`,
        'string.empty': `"cloudinary_id" cannot be an empty field`,
    }),
    avatar: Joi.string().optional().messages({
        'string.base': `"avatar" should be a "String"`,
        'string.empty': `"avatar" cannot be an empty field`,
    }),
})

//User-defined function to validate the user
const userValidation = (userData) => {
    const UserSchema = {
        bio: bio,
        profile_picture: profile_picture,
    }

    const JoiSchema = Joi.object(UserSchema)

    return JoiSchema.validate(userData)
}

module.exports = { userValidation }