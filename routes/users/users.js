const router = require('express').Router()
const {
  allUsers,
  specificUser,
  updateUserAccount,
  deleteUserAccount,
} = require('../../controller/users/index')
const {
  allFollowers,
  allFollowings,
  follow,
  unfollow,
} = require('../../controller/users/followers_and_followings')
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

// followers
router.get('/followers/:user_id', allFollowers)
router.get('/followings/:user_id', allFollowings)
router.post('/follow/:current_user_id/:another_user_id', follow)
router.post('/unfollow/:current_user_id/:another_user_id', unfollow)
// router.post('/unfollow/:user_id/:follower_id', unfollow)

//
//
module.exports = router
