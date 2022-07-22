const router = require('express').Router()
//
/* Posts */
const {
  newPostComment,
  singlePostComment,
  deletePostComment,
} = require('../controller/reactions.posts.comments')
const {
  newPostLike,
  reversePostLike,
} = require('../controller/reactions.posts.likes')

/* Posts Comments */
router.get('/post/comments/:comment_id', singlePostComment)
router.post('/post/comments/:commenter_id/:post_id', newPostComment)
router.delete('/post/comments/:commenter_id/:comment_id', deletePostComment)
/* Posts Likes */
router.post('/post/likes/:liker_id/:post_id', newPostLike)
router.delete('/post/likes/:liker_id/:like_id', reversePostLike)

//
/* Competitions */
const {
  newCompetitionComment,
  singleCompetitionComment,
  deleteCompetitionComment,
} = require('../controller/reactions.competitions.comments')
const {
  newCompetitionLike,
  reverseCompetitionLike,
} = require('../controller/reactions.competitions.likes')

/* Competitions Comments */
router.post(
  '/competition/comments/:commenter_id/:competition_id',
  newCompetitionComment,
)
router.get('/competition/comments/:comment_id', singleCompetitionComment)
router.delete(
  '/competition/comments/:commenter_id/:comment_id',
  deleteCompetitionComment,
)
/* Competitions Likes */
router.post('/competition/likes/:liker_id/:competition_id', newCompetitionLike)
router.delete('/competition/likes/:liker_id/:like_id', reverseCompetitionLike)

//
/* Scholarships */
const {
  newScholarshipComment,
  singleScholarshipComment,
  deleteScholarshipComment,
} = require('../controller/reactions.scholarships.comments')
const {
  newScholarshipLike,
  reverseScholarshipLike,
} = require('../controller/reactions.scholarships.likes')

/* Scholarships Comments */
router.post(
  '/scholarship/comments/:commenter_id/:scholarship_id',
  newScholarshipComment,
)
router.get('/scholarship/comments/:comment_id', singleScholarshipComment)
router.delete(
  '/scholarship/comments/:commenter_id/:comment_id',
  deleteScholarshipComment,
)
/* Scholarships Likes */
router.post('/scholarship/likes/:liker_id/:scholarship_id', newScholarshipLike)
router.delete('/scholarship/likes/:liker_id/:like_id', reverseScholarshipLike)

module.exports = router
