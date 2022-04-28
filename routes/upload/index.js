const express = require('express')
const router = express.Router()
const multer = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}__${file.originalname}`)
    },
})

const upload = multer({
    storage: fileStorageEngine,
})

const maximum_image_upload = 4
router.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file)
    res.send('single file uploaded')
})

router.post(
    '/multiple',
    upload.array('images', maximum_image_upload),
    (req, res) => {
        console.log(req.files)
        res.send('multiple files upload succesful')
    },
)

module.exports = router