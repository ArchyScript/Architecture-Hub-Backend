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
    //   like_type can be any type of reaction (e.g like, heart, emoji) per post by the user
    like_type: Joi.string().required(),
  }

  const JoiSchema = Joi.object(LikeSchema)
  return JoiSchema.validate(reactionData)
}

module.exports = { commentValidation, likeValidation }
