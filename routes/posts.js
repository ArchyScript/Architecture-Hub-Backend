const router = require('express').Router()
const {
  allPosts,
  newPostWithoutImage,
  newPostWithImage,
  singlePost,
  // updatePost,
  deletePost,
} = require('../controller/posts')
const { upload } = require('../config/multer')
const { verifyUserToken } = require('../middlewares/verifyUserToken')

// get all posts
router.get('/', allPosts)
router.get('/:post_id', singlePost)
router.post('/new/:poster_id', newPostWithoutImage)
// router.post('/new/:poster_id', newPostWithImage)
router.post(
  '/new/upload/:poster_id',
  upload.single('post-image'),
  newPostWithImage,
)
// router.patch('/:poster_id/:post_id', updatePost)
router.delete('/delete/:poster_id/:post_id', deletePost)

// router.get('/', verifyUserToken, allPosts)
// router.get('/:post_id', verifyUserToken, singlePost)
// router.post('/', verifyUserToken, newPostWithoutImage)
// router.patch('/:post_id', verifyUserToken, updatePost)
// router.delete('/:post_id', verifyUserToken, deletePost)

module.exports = router
