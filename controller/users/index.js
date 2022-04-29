const User = require('../../models/users/Users')
const Joi = require('joi')

const userSchema = {
    name: Joi.string().required().min(4).max(1024),
    email: Joi.string().required().min(4).max(1024).email(),
}

const allUsers = (req, res) => {
    console.log(User.find())
    res.send('All users')
}

const createUser = async(req, res) => {
    // const validation = Joi.validate(req.body, userSchema)

    // res.send(validation)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        res.status(400).send(error)
    }

    // console.log(userSchema)

    // res.send('create new user')
}

module.exports = { allUsers, createUser }