const router = require('express').Router()

const { allUsers, signup, login } = require('../../controller/auth/index.js')

router.get('/all', allUsers)
router.post('/signup', signup)
router.post('/login', login)

// router.post('/signup', validateCredentials, signup)
// router.post('/login', validateCredentials, login)

module.exports = router