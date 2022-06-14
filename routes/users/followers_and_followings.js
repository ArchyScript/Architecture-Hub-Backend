const router = require('express').Router()
const {
  allFollowers,
} = require('../../controller/users/followers_and_followings')

router.get('/:user_id', allFollowers)

module.exports = router
