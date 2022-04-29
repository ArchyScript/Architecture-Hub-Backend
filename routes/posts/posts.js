const router = require('express').Router()

const {
    allPosts,
    publicPosts,
    privatePosts,
} = require('../../controller/posts/index')

// Mideware for protected routes
const { checkUserAuth } = require('../../middlewares/checkUserAuth')

// get all posts
router.get('/', allPosts)

// public post
router.get('/public', publicPosts)

// private posts
router.get('/private', checkUserAuth, privatePosts)

module.exports = router