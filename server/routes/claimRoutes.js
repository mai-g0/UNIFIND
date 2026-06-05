const express = require('express')
const {
  createClaim,
  getClaims,
  updateClaimStatus,
} = require('../controllers/claimController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createClaim)
router.get('/', protect, getClaims)
router.patch('/:id/status', protect, adminOnly, updateClaimStatus)

module.exports = router