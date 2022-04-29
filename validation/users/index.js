const Joi = require('joi')

const userSchema = {
    name: Joi.string().required().min(4).max(1024),
    email: Joi.string().required().min(4).max(1024).email(),
}

module.exports = { userSchema }