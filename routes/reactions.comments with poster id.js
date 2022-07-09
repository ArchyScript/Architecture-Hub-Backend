const router = require('express').Router()
const {
  allComments,
  createComment,
  singleComment,
  updateComment,
  deleteComment,
} = require('../controller/reactions.comments')

router.get('/', allComments)
router.get('/:comment_id', singleComment)
router.post('/:commenter_id/:post_id', createComment)
router.patch('/:post_id/:comment_id', updateComment)
router.delete('/:post_id/:comment_id', deleteComment)

// router.get('/', allComments)
// router.get('/:post_id/:user_id', singleComment)
// router.post('/:post_id/:user_id', createComment)
// router.patch('/:post_id/:user_id', updateComment)
// router.delete('/:post_id/:user_id', deleteComment)

module.exports = router
