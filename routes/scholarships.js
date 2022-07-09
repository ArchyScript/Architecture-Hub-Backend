const router = require('express').Router()
const {
  allPosts,
  createPost,
  // specificPost,
  updatePost,
  deletePost,
} = require('../controller/posts')

// get all posts
router.get('/', allPosts)
// router.get('/:post_id', specificPost)
router.post('/', createPost)
router.patch('/:post_id', updatePost)
router.delete('/:post_id', deletePost)

module.exports = router
