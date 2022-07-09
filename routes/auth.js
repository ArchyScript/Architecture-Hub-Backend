const router = require('express').Router()
const {
  signup,
  login,
  resetPassword,
  logout,
  allAuthUsers,
  specificAuthUser,
} = require('../controller/auth')
const { verifyUserToken } = require('../middlewares/verifyUserToken')

router.get('/auth-users', allAuthUsers)
router.get('/user/:_id', specificAuthUser)
router.post('/signup', signup)
router.post('/reset-password', verifyUserToken, resetPassword)
router.post('/login', login)
router.post('/logout', verifyUserToken, logout)

module.exports = router
