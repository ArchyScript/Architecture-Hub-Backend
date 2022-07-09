const router = require('express').Router()
const {
  getAllUsers,
  getSingleUser,
  createUserProfile,
  updateUser,
  deleteUser,
} = require('../controller/uploads copy')
const { upload } = require('../config/multer')

//
// post upload
router.get('/single', getAllUsers)
router.get('/single/:id', getSingleUser)
router.post('/single/', upload.single('image'), createUserProfile)
router.patch('/single/:id', upload.single('image'), updateUser)
router.delete('/single/:id', deleteUser)

module.exports = router
