const User = require('../models/User')
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')
const Claim = require('../models/Claim')

async function getAdminStats(req, res) {
  try {
    const [totalUsers, lostItems, foundItems, claims] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      Claim.countDocuments(),
    ])

    res.json({
      totalUsers,
      lostItems,
      foundItems,
      claims,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAdminStats,
}