const router = require('express').Router()
const {
  signup,
  loginWithEmail,
  loginWithUsername,
  resetPassword,
  logout,
  changePassword,
} = require('../controller/auth')
const { verifyUserToken } = require('../middlewares/verifyUserToken')

// router.get('/auth-users', allAuthUsers)
// router.get('/user/:_id', specificAuthUser)
router.post('/signup', signup)
router.post('/login/email', loginWithEmail)
router.post('/login/username', loginWithUsername)
router.post('/reset-password', resetPassword)
router.post('/change-password', changePassword)
// router.post('/reset-password', verifyUserToken, resetPassword)
router.post('/logout', verifyUserToken, logout)

module.exports = router
