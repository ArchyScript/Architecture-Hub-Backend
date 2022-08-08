const multer = require('multer')

const fileStorageEngine = multer.diskStorage({})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    return cb(new Error('file type not supported'), false)
  }
}

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 bytes'
  }
  const dm = decimal || 2
  const sizes = ["'Bytes", 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB']

  const index = Math.floor(Math.log(bytes) / Math.log(1000))
  const result =
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '-' + sizes[index]
}

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

module.exports = { upload }
