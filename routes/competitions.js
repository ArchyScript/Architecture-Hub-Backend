const router = require('express').Router()
const {
  allCompetitions,
  specificCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} = require('../controller/competitions')
const { upload } = require('../config/multer')

// get all posts
router.get('/', allCompetitions)
router.get('/:competition_id', specificCompetition)
router.post(
  '/:creator_id',
  upload.single('competition-image'),
  createCompetition,
)
// router.post('/:creator_id', createCompetition)
router.patch('/:creator_id/:competition_id', updateCompetition)
router.delete('/:creator_id/:competition_id', deleteCompetition)

module.exports = router
