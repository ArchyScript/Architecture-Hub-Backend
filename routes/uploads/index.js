const router = require('express').Router()
const {
    singleUpload,
    multipleUploads,
    upload,
    maximum_image_upload,
} = require('../../controller/uploads/index')

//
//
//
//
// single image upload
router.post('/profile', upload.single('image'), singleUpload)

router.post('/single', upload.single('image'), singleUpload)

// multiple files upload
router.post(
    '/multiple',
    upload.array('images', maximum_image_upload),
    multipleUploads,
)

module.exports = router