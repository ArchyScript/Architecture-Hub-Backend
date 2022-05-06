const router = require('express').Router()
const {
    allUsers,
    specificUser,
    updateUserAccount,
    deleteUserAccount,
} = require('../../controller/users/index')

//
router.get('/', allUsers)
router.get('/:user_id', specificUser)
router.patch('/:user_id', updateUserAccount)
router.delete('/:user_id', deleteUserAccount)

module.exports = router