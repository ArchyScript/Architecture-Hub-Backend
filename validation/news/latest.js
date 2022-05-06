const Joi = require('joi')

//User-defined function to validate the user
const postValidation = (postData) => {
    const PostSchema = {
        title: Joi.string().min(4).max(256).required(),
        content: Joi.string().min(10).max(1024).required(),
        no_of_likes: Joi.number().required(),
        no_of_comments: Joi.number().required(),
        people_engages_in_post: Joi.array().optional(),
    }

    const JoiSchema = Joi.object(PostSchema)
    return JoiSchema.validate(postData)
}

module.exports = { postValidation }