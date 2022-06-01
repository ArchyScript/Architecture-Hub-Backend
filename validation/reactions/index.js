const Joi = require('joi')

const commentValidation = (reactionData) => {
    const CommentSchema = {
        comment: Joi.string().min(10).max(1024).required(),
    }

    const JoiSchema = Joi.object(CommentSchema)
    return JoiSchema.validate(reactionData)
}

const likeValidation = (reactionData) => {
    const LikeSchema = {
        type: Joi.string().min(4).max(256).required(),
    }

    const JoiSchema = Joi.object(LikeSchema)
    return JoiSchema.validate(reactionData)
}

module.exports = { commentValidation, likeValidation }