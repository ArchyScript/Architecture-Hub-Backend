const router = require('express').Router()
const {
    allPosts,
    createPost,
    specificPost,
    updatePost,
    deletePost,
} = require('../../controller/posts/index')
    // const { checkUserAuth } = require('../../middlewares/checkUserAuth')

// get all posts
router.get('/', allPosts)
    // router.get('/', checkUserAuth, allPosts)
router.get('/:post_id', specificPost)
router.post('/', createPost)
router.patch('/:post_id', updatePost)
router.delete('/:post_id', deletePost)

module.exports = router