const router = require('express').Router()
const {
  singleBookmarkedPost,
  addToBookmarked,
  removeFromBookmarked,
} = require('../controller/bookmarks')

//
router.get('/:post_type/:post_id', singleBookmarkedPost)
router.patch('/add/:user_id/:post_type/:post_id', addToBookmarked)
router.patch('/remove/:user_id/:post_type/:post_id', removeFromBookmarked)

module.exports = router
