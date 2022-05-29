const router = require('express').Router()
const {
    allPosts,
    createPost,
    specificPost,
    updatePost,
    deletePost,
} = require('../../controller/posts/index')
const { verifyUserToken } = require('../../middlewares/auth/verifyUserToken')

// get all posts
// router.get('/', allPosts)
router.get('/', allPosts)
router.get('/:post_id', specificPost)
router.post('/', createPost)
router.patch('/:post_id', updatePost)
router.delete('/:post_id', deletePost)

// router.get('/', verifyUserToken, allPosts)
// router.get('/:post_id', verifyUserToken, specificPost)
// router.post('/', verifyUserToken, createPost)
// router.patch('/:post_id', verifyUserToken, updatePost)
// router.delete('/:post_id', verifyUserToken, deletePost)

module.exports = router