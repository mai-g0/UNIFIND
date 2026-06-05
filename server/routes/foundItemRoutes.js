const express = require('express')
const {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
} = require('../controllers/foundItemController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createFoundItem)
router.get('/', protect, getFoundItems)
router.put('/:id', protect, updateFoundItem)
router.delete('/:id', protect, deleteFoundItem)

module.exports = router