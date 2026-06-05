const Claim = require('../models/Claim')
const Notification = require('../models/Notification')
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

async function createClaim(req, res) {
  try {
    const { lostItem, foundItem, proofOfOwnership } = req.body

    const claim = await Claim.create({
      lostItem,
      foundItem,
      proofOfOwnership,
      claimant: req.user._id,
    })

    res.status(201).json({
      message: 'Claim request submitted successfully',
      claim,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getClaims(req, res) {
  try {
    const claims = await Claim.find()
      .populate('lostItem', 'itemName category description image')
      .populate('foundItem', 'itemName category description foundLocation image')
      .populate('claimant', 'fullName email phone')
      .sort({ createdAt: -1 })

    res.json(claims)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function updateClaimStatus(req, res) {
  try {
    const { status } = req.body

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('lostItem', 'itemName category description image')
      .populate('foundItem', 'itemName category description foundLocation image')
      .populate('claimant', '_id fullName email phone')

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' })
    }

    await Notification.create({
  user: claim.claimant._id,
  title: 'Claim status updated',
  message: `Your claim for ${claim.foundItem.itemName} is now ${status.replaceAll('_', ' ')}.`,
})

if (status === 'approved') {
  await LostItem.findByIdAndUpdate(claim.lostItem._id, {
    status: 'claimed',
  })

  await FoundItem.findByIdAndUpdate(claim.foundItem._id, {
    status: 'claimed',
  })
}

    res.json({
      message: 'Claim status updated successfully',
      claim,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createClaim,
  getClaims,
  updateClaimStatus,
}