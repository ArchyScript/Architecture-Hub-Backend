const multer = require('multer')
const path = require('path')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },

    filename: (req, file, cb) => {
        // cb(null, `${Date.now()}__${file.originalname}`)
        cb(
            null,
            `${new Date().toISOString().replace(/:/g, '-')}__${file.originalname}`,
        )
    },
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// const specificProfilePicture = (req, res) => {
//     console.log(req.file)
//     res.send('single file uploaded successful: ', res.file)
// }

const singleUpload = (req, res, next) => {
    try {
        const file = req.file
        res.status(201).send(file)
    } catch (err) {
        res.send(err)
    }
}

const multipleUploads = (req, res) => {
    console.log(req.files)
    res.send('multiple files upload succesfull')
}

const upload = multer({
    storage: fileStorageEngine,
    fileFilter: fileFilter,
})

module.exports = { upload, singleUpload }