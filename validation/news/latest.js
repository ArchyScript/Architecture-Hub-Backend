const Joi = require('joi')

//User-defined function to validate the user
const LatestValidation = (postData) => {
  const PostSchema = {
    title: Joi.string().min(4).max(256).required(),
    content: Joi.string().min(10).max(1024).required(),
  }

  const JoiSchema = Joi.object(PostSchema)
  return JoiSchema.validate(postData)
}

module.exports = { LatestValidation }
