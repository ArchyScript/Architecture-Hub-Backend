const router = require('express').Router()

const {
    signup,
    login,
    resetPassword,
    logout,
    allAuthUsers,
} = require('../../controller/auth/index')

router.get('/auth-users', allAuthUsers)
router.post('/signup', signup)
router.post('/reset-password', resetPassword)
router.post('/login', login)
router.post('/logout', logout)

module.exports = router