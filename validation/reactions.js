const Joi = require('joi')

const commentValidation = (commentData) => {
  const CommentSchema = {
    comment: Joi.string().max(256).required(),
  }

  const JoiSchema = Joi.object(CommentSchema)
  return JoiSchema.validate(commentData)
}

const likeValidation = (likeData) => {
  const LikeSchema = {
    //   like_type can be any type of reaction (e.g like, heart, emoji) per post by the user
    like_type: Joi.string().required(),
  }

  const JoiSchema = Joi.object(LikeSchema)
  return JoiSchema.validate(likeData)
}

module.exports = { commentValidation, likeValidation }
