const router = require('express').Router()
const { addPicture } = require('../../controller/uploads/index')
const { upload } = require('../../utilities/multer')
    //
    //
    //

// single image
// profile upload
// router.post('/profile', upload.single('image'), singleUpload)

// post upload
router.post('/single', upload.single('image'), addPicture)

// multiple files upload
// router.post(
//     '/multiple',
//     upload.array('images', maximum_image_upload),
//     multipleUploads,
// )

module.exports = router