const router = require('express').Router()
const {
  allPosts,
  createPost,
  singlePost,
  updatePost,
  deletePost,
} = require('../controller/posts')
const { verifyUserToken } = require('../middlewares/verifyUserToken')

// get all posts
router.get('/', allPosts)
router.get('/:post_id', singlePost)
router.post('/new/:user_id', createPost)
router.patch('/:user_id/:post_id', updatePost)
router.delete('/:user_id/:post_id', deletePost)

// router.get('/', verifyUserToken, allPosts)
// router.get('/:post_id', verifyUserToken, singlePost)
// router.post('/', verifyUserToken, createPost)
// router.patch('/:post_id', verifyUserToken, updatePost)
// router.delete('/:post_id', verifyUserToken, deletePost)

module.exports = router