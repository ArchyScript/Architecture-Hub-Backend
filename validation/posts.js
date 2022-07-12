const Joi = require('joi')

const postWithoutImageValidation = (postData) => {
  const PostSchema = {
    content: Joi.string().min(10).max(1024).required(),
  }

  const JoiSchema = Joi.object(PostSchema)
  return JoiSchema.validate(postData)
}

const postWithImageValidation = (postData) => {
  const PostSchema = {
    content: Joi.string().min(10).max(1024).required(),
    file_path: Joi.string().required(),
  }

  const JoiSchema = Joi.object(PostSchema)
  return JoiSchema.validate(postData)
}
module.exports = { postWithoutImageValidation, postWithImageValidation }
