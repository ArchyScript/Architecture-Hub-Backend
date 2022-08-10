const Joi = require('joi')

//User-defined function to validate the user
const scholarshipValidation = (scholarshipData) => {
  const ScholarshipSchema = {
    title: Joi.string().min(4).max(256).required(),
    link: Joi.string().required(),
    host: Joi.string().required(),
    file_path: Joi.string().required(),
    description: Joi.string().min(15).max(1024).required(),
    content: Joi.string().min(10).max(1024).required(),
  }

  const JoiSchema = Joi.object(ScholarshipSchema)
  return JoiSchema.validate(scholarshipData)
}

module.exports = { scholarshipValidation }
