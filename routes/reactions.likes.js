const router = require('express').Router()
const {
  allLikes,
  createLike,
  singleLike,
  unlike,
  deleteLike,
} = require('../controller/reactions.likes')

router.get('/', allLikes)
router.get('/:like_id', singleLike)
router.post('/:liker_id/:post_id', createLike)
// router.patch('/:like_id', inlike)
router.delete('/:liker_id/:like_id', deleteLike)

module.exports = router
