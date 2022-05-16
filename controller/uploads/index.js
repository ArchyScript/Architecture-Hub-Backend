const multer = require('multer')
const maximum_image_upload = 4

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

// all Profile pictures
const allProfilePictures = (req, res) => {
    console.log(req.file)
    res.send('single file uploaded successful: ', res.file)
}
const specificProfilePicture = (req, res) => {
    console.log(req.file)
    res.send('single file uploaded successful: ', res.file)
}

const singleUpload = (req, res) => {
    try {
        res.send('single file uploaded successful')
    } catch (err) {
        res.send(err)
    }
}

const multipleUploads = (req, res) => {
    console.log(req.files)
    res.send('multiple files upload succesfull')
}

module.exports = { singleUpload, multipleUploads, upload, maximum_image_upload }