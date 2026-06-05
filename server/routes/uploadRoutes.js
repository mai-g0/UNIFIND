const express = require('express')
const upload = require('../middleware/uploadMiddleware')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }

    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    })
  })
})

module.exports = router