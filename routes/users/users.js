const router = require('express').Router()

const { allUsers, createUser } = require('../../controller/users/index')

// Mideware for protected routes

// get all posts
router.get('/', allUsers)

// create new user
router.post('/', createUser)

module.exports = router