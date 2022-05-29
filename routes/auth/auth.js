const router = require('express').Router()

const {
    signup,
    login,
    resetPassword,
    logout,
} = require('../../controller/auth/index.js')

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/reset-password', resetPassword)

// router.post('/logout', login)

module.exports = router