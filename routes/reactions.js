const router = require('express').Router()
//
/* Posts */
const {
  allPostsComments,
  newPostComment,
  singlePostComment,
  deletePostComment,
} = require('../controller/reactions.posts.comments')
const {
  allPostsLikes,
  newPostLike,
  reversePostLike,
} = require('../controller/reactions.posts.likes')

/* Posts Comments */
router.get('/post/comments', allPostsComments)
router.get('/post/comments/:comment_id', singlePostComment)
router.post('/post/comments/:commenter_id/:post_id', newPostComment)
router.delete('/post/comments/:commenter_id/:comment_id', deletePostComment)
/* Posts Likes */
router.get('/post/likes', allPostsLikes)
router.post('/post/likes/:liker_id/:post_id', newPostLike)
router.delete('/post/likes/:liker_id/:like_id', reversePostLike)

//
/* Competitions */
const {
  allCompetitionsComments,
  newCompetitionComment,
  singleCompetitionComment,
  deleteCompetitionComment,
} = require('../controller/reactions.competitions.comments')
const {
  newCompetitionLike,
  allCompetitionsLikes,
  reverseCompetitionLike,
} = require('../controller/reactions.competitions.likes')

/* Competitions Comments */
router.post(
  '/competition/comments/:commenter_id/:competition_id',
  newCompetitionComment,
)
router.get('/competition/comments', allCompetitionsComments)
router.get('/competition/comments/:comment_id', singleCompetitionComment)
router.delete(
  '/competition/comments/:commenter_id/:comment_id',
  deleteCompetitionComment,
)
/* Competitions Likes */
router.get('/competition/likes', allCompetitionsLikes)
router.post('/competition/likes/:liker_id/:competition_id', newCompetitionLike)
router.delete('/competition/likes/:liker_id/:like_id', reverseCompetitionLike)

//
/* Scholarships */
const {
  allScholarshipsComments,
  newScholarshipComment,
  singleScholarshipComment,
  deleteScholarshipComment,
} = require('../controller/reactions.scholarships.comments')
const {
  allScholarshipsLikes,
  newScholarshipLike,
  reverseScholarshipLike,
} = require('../controller/reactions.scholarships.likes')

/* Scholarships Comments */
router.post(
  '/scholarship/comments/:commenter_id/:scholarship_id',
  newScholarshipComment,
)
router.get('/scholarship/comments', allScholarshipsComments)
router.get('/scholarship/comments/:comment_id', singleScholarshipComment)
router.delete(
  '/scholarship/comments/:commenter_id/:comment_id',
  deleteScholarshipComment,
)
/* Scholarships Likes */
router.get('/scholarship/likes', allScholarshipsLikes)
router.post('/scholarship/likes/:liker_id/:scholarship_id', newScholarshipLike)
router.delete('/scholarship/likes/:liker_id/:like_id', reverseScholarshipLike)

module.exports = router
