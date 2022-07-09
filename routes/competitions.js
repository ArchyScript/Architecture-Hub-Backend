const router = require('express').Router()
const {
  allCompetitions,
  specificCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} = require('../controller/news.competitions')

// get all posts
router.get('/', allCompetitions)
router.get('/:post_id', specificCompetition)
router.post('/', createCompetition)
router.patch('/:post_id', updateCompetition)
router.delete('/:post_id', deleteCompetition)

module.exports = router
