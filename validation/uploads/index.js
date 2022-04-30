const Joi = require('joi')

//User-defined function to validate the user
const postValidation = (postData) => {
    const PostSchema = {
        title: Joi.string().min(4).max(256).required(),
        content: Joi.string().min(10).max(1024).required(),
        no_of_likes: Joi.number().required(),
        no_of_comments: Joi.number().required(),
        // people_engages_in_post: Joi.array(),
    }

    const JoiSchema = Joi.object(PostSchema)

    return JoiSchema.validate(postData)
        // const JoiSchema = Joi.object({
        //     username: Joi.string().min(5).max(30).required(),

    //     email: Joi.string().email().min(5).max(50).optional(),

    //     date_of_birth: Joi.date().optional(),

    //     account_status: Joi.string()
    //         .valid('activated')
    //         .valid('unactivated')
    //         .optional(),
    // }).options({ abortEarly: false })
}

// const user = {
//     username: 'Pritish',
//     email: 'pritish@gmail.com',
//     date_of_birth: '2020-8-11',
//     account_status: 'activated',
// }

// const response = postValidation(user)

// if (response.error) {
//     console.log(response.error.details)
// } else {
//     console.log('Validated Data')
// }

module.exports = { postValidation }