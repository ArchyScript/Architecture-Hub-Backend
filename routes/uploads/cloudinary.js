const router = require('express').Router()
const {
    singleUpload,
    upload,
    //     maximum_image_upload,
} = require('../../helpers/file_helper')

router.get('/', (req, res) => {
    res.send('Thanks')
})

// single file upload
router.post('/single', upload.single('file'), singleUpload)

module.exports = router