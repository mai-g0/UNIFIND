const LostItem = require('../models/LostItem')

async function createLostItem(req, res) {
  try {
    const lostItem = await LostItem.create({
      itemName: req.body.itemName,
      category: req.body.category,
      description: req.body.description,
      lastSeenLocation: req.body.lastSeenLocation,
      dateLost: req.body.dateLost,
      image: req.body.image || '',
      reportedBy: req.user._id,
    })

    res.status(201).json({
      message: 'Lost item reported successfully',
      lostItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getLostItems(req, res) {
  try {
    const lostItems = await LostItem.find()
      .populate('reportedBy', 'fullName email phone')
      .sort({ createdAt: -1 })

    res.json(lostItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function updateLostItem(req, res) {
  try {
    const lostItem = await LostItem.findById(req.params.id)

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' })
    }

    if (lostItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this item' })
    }

    if (lostItem.status === 'claimed') {
      return res.status(400).json({ message: 'Claimed items cannot be updated' })
    }

    lostItem.itemName = req.body.itemName || lostItem.itemName
    lostItem.category = req.body.category || lostItem.category
    lostItem.description = req.body.description || lostItem.description
    lostItem.lastSeenLocation = req.body.lastSeenLocation || lostItem.lastSeenLocation
    lostItem.dateLost = req.body.dateLost || lostItem.dateLost
    lostItem.image = req.body.image || lostItem.image

    const updatedLostItem = await lostItem.save()

    res.json({
      message: 'Lost item updated successfully',
      lostItem: updatedLostItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function deleteLostItem(req, res) {
  try {
    const lostItem = await LostItem.findById(req.params.id)

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' })
    }

    if (lostItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this item' })
    }

    if (lostItem.status === 'claimed') {
      return res.status(400).json({ message: 'Claimed items cannot be deleted' })
    }

    await lostItem.deleteOne()

    res.json({ message: 'Lost item deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createLostItem,
  getLostItems,
  updateLostItem,
  deleteLostItem,
}