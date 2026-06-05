const express = require('express')
const { createMessage, getMessages } = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createMessage)
router.get('/', protect, getMessages)

module.exports = router