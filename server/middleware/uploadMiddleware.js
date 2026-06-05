const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadFolder = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder)
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadFolder)
  },

  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

function fileFilter(req, file, cb) {
  const allowedTypes = /jpg|jpeg|png|webp/

  const extensionIsValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )

  const mimeTypeIsValid = allowedTypes.test(file.mimetype)

  if (extensionIsValid && mimeTypeIsValid) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports = upload