const router = require('express').Router()
const {
  allScholarships,
  specificScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require('../controller/scholarships')
const { upload } = require('../config/multer')

// get all posts
router.get('/', allScholarships)
router.get('/:scholarship_id', specificScholarship)
router.post(
  '/:creator_id',
  upload.single('scholarship-image'),
  createScholarship,
)
// router.post('/:creator_id', createScholarship)
router.patch('/:creator_id/:scholarship_id', updateScholarship)
router.delete('/:creator_id/:scholarship_id', deleteScholarship)

module.exports = router
