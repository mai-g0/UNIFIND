const express = require('express')
const { createLostItem, getLostItems, updateLostItem, deleteLostItem } = require('../controllers/lostItemController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createLostItem)
router.put('/:id', protect, updateLostItem)
router.get('/', protect, getLostItems)
router.delete('/:id', protect, deleteLostItem)

module.exports = router