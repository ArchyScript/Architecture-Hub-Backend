const Joi = require('joi')

const postWithoutImageValidation = (postData) => {
  const PostSchema = {
    content: Joi.string().max(512).required(),
  }

  const JoiSchema = Joi.object(PostSchema)
  return JoiSchema.validate(postData)
}

const postWithImageValidation = (postData) => {
  const PostSchema = {
    content: Joi.string().max(512).optional(),
    file_path: Joi.string().required(),
  }

  const JoiSchema = Joi.object(PostSchema)
  return JoiSchema.validate(postData)
}
module.exports = { postWithoutImageValidation, postWithImageValidation }
