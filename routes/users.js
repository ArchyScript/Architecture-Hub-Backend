const router = require('express').Router()
const {
  allUsers,
  specificUserById,
  specificUserByUsername,
  updateUserAccount,
  deleteUserAccount,
} = require('../controller/users')
const {
  allFollowers,
  allFollowings,
  follow,
  unfollow,
} = require('../controller/users.followers_and_followings')
const {
  uploadProfilePicture,
  deleteProfilePicture,
} = require('../controller/users.profie-upload')
const { upload } = require('../config/multer')
const { verifyUserToken } = require('../middlewares/verifyUserToken')

//
// router.get('/', verifyUserToken, allUsers)
// router.get('/:user_id', verifyUserToken, specificUserById)
// router.patch('/:user_id', verifyUserToken, updateUserAccount)
// // delete account
// router.delete('/:user_id', verifyUserToken, deleteUserAccount)

// // Profile Picture uploaad
// router.post(
//   '/profile/:user_id',
//   upload.single('profile-picture'),
//   verifyUserToken,
//   uploadProfilePicture,
// )

// // followers
// router.get('/followers/:user_id', verifyUserToken, allFollowers)
// router.get('/followings/:user_id', verifyUserToken, allFollowings)
// router.post(
//   '/follow/:current_user_id/:another_user_id',
//   verifyUserToken,
//   follow,
// )
// router.post(
//   '/unfollow/:current_user_id/:another_user_id',
//   verifyUserToken,
//   unfollow,
// )

//
router.get('/', allUsers)
router.get('/_id/:_id', specificUserById)
router.get('/username/:username', specificUserByUsername)
router.patch('/update/:_id', updateUserAccount)
// delete account
router.delete('/delete/:_id', deleteUserAccount)

// Upload Profile Picture
router.post(
  '/profile/upload/:_id',
  upload.single('profile-picture'),
  uploadProfilePicture,
)
// Delete profile picture
router.delete('/profile/delete/:_id', deleteProfilePicture)

// followers
router.get('/followers/:user_id', allFollowers)
router.get('/followings/:user_id', allFollowings)
router.post('/follow/:current_user_id/:another_user_id', follow)
router.post('/unfollow/:current_user_id/:another_user_id', unfollow)

//
//
module.exports = router
