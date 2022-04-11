const express = require('express')
const router = express.Router()
    // import user database
const { users } = require('../../db/db')
const secretKey = 'ArchyScript@10'

const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

//
router.post(
    '/signup', [
        check('email', 'Please, provide a valid email').isEmail(),
        check('password', 'Please provide a valid passwowrd').isLength({
            min: 6,
            max: 50,
        }),
    ],
    async(req, res) => {
        const { password, email } = req.body

        // Validated user account
        // assigns the users request to the constant value of 'error' and validates each respective data provided by the user
        const errors = validationResult(req)

        // if error is found
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            })
        }

        // Validate if user already exist and return the users email
        const user = users.find((user) => {
            // CHECKS IF USER EMAIL  APLREADY EXIST, REURN UNDEFINED IF YES AND THE USER'S EMAIL IF NO
            return user.email === email
        })

        // check if email is not in users database
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'User already exist',
                }, ],
            })
        }

        // Hash password
        let hashedPassword = await bcrypt.hash(password, 10)

        users.push({
            email: email,
            password: hashedPassword,
        })

        const token = await JWT.sign({
                email,
            },
            secretKey, {
                expiresIn: 3900000,
            },
        )

        // res.send(password)
        res.json({ token })
            // res.send('User signup')
    },
)

module.exports = router