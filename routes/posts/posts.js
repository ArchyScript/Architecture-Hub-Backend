const router = require('express').Router()

const {
    allPosts,
    createPost,
    specificPost,
    updatePost,
    deletePost,
} = require('../../controller/posts/index')

// Mideware for protected routes
// const { checkUserAuth } = require('../../middlewares/checkUserAuth')

// get all posts
router.get('/', allPosts)
    // router.get('/', (req, res) => {
    //     res.send('test')
    // })

// get single post
router.get('/:post_id', specificPost)

// create post
router.post('/', createPost)

// update post
router.patch('/:post_id', updatePost)

// delete post
router.delete('/:post_id', deletePost)

// // public post
// router.get('/public', publicPosts)

// // private posts
// router.get('/private', checkUserAuth, privatePosts)

module.exports = router