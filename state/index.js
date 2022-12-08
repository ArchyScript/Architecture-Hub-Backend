// const router = require('express').Router()

const updateState = (router, id, callback) => {
    router.delete(`/:${id}`, callback)
}

// module.exports = router