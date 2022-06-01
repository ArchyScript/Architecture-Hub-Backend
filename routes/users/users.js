const router = require('express').Router()
const {
    allUsers,
    specificUser,
    updateUserAccount,
    deleteUserAccount,
} = require('../../controller/users/index')
const { uploadProfilePicture } = require('../../controller/users/profie-upload')
const { upload } = require('../../config/multer')

//
router.get('/', allUsers)
router.get('/:user_id', specificUser)
router.patch('/:user_id', updateUserAccount)

// delete account
router.delete('/:user_id', deleteUserAccount)

// Profile Picture uploaad
router.post('/profile/:user_id', upload.single('image'), uploadProfilePicture)

module.exports = router