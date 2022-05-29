const router = require('express').Router()

const { signup, login } = require('../../controller/auth/index.js')

router.post('/signup', signup)
router.post('/login', login)
    // router.post('/reset-password', resetPassword)

module.exports = router