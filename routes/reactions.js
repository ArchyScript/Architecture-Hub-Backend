const router = require('express').Router()
const {
  newComment,
  singleComment,
  // updateComment,
  deleteComment,
} = require('../controller/reactions.comments')
const {
  newLike,
  // singleLike,
  reverseLike,
} = require('../controller/reactions.likes')

/* Comments */
// router.get('/comments/', allComments)
router.get('/comments/:comment_id', singleComment)
router.post('/comments/:commenter_id/:post_id', newComment)
// router.patch('/comments/:comment_id', updateComment)
router.delete('/comments/:commenter_id/:comment_id', deleteComment)

// router.get('/comments/', allComments)
// router.get('/comments/:comment_id', singleComment)
// router.post('/comments/:commenter_id/:post_id', newComment)
// router.patch('/comments/:post_id/:comment_id', updateComment)
// router.delete('/comments/:post_id/:comment_id', deleteComment)

// router.get('/comments/', allComments)
// router.get('/comments/:post_id/:user_id', singleComment)
// router.post('/comments/:post_id/:user_id', newComment)
// router.patch('/comments/:post_id/:user_id', updateComment)
// router.delete('/comments/:post_id/:user_id', deleteComment)

/* Likes */
// router.get('/likes/', allLikes)
// router.get('/likes/:like_id', singleLike)
router.post('/likes/:liker_id/:post_id', newLike)
router.delete('/likes/:liker_id/:like_id', reverseLike)

module.exports = router
