const FoundItem = require('../models/FoundItem')

async function createFoundItem(req, res) {
  try {
    const foundItem = await FoundItem.create({
      itemName: req.body.itemName,
      category: req.body.category,
      description: req.body.description,
      foundLocation: req.body.foundLocation,
      dateFound: req.body.dateFound,
      image: req.body.image || '',
      reportedBy: req.user._id,
    })

    res.status(201).json({
      message: 'Found item reported successfully',
      foundItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getFoundItems(req, res) {
  try {
    const foundItems = await FoundItem.find()
      .populate('reportedBy', 'fullName email phone')
      .sort({ createdAt: -1 })

    res.json(foundItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function updateFoundItem(req, res) {
  try {
    const foundItem = await FoundItem.findById(req.params.id)

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' })
    }

    if (foundItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this item' })
    }

    if (foundItem.status === 'claimed') {
      return res.status(400).json({ message: 'Claimed items cannot be updated' })
    }

    foundItem.itemName = req.body.itemName || foundItem.itemName
    foundItem.category = req.body.category || foundItem.category
    foundItem.description = req.body.description || foundItem.description
    foundItem.foundLocation = req.body.foundLocation || foundItem.foundLocation
    foundItem.dateFound = req.body.dateFound || foundItem.dateFound
    foundItem.image = req.body.image || foundItem.image

    const updatedFoundItem = await foundItem.save()

    res.json({
      message: 'Found item updated successfully',
      foundItem: updatedFoundItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function deleteFoundItem(req, res) {
  try {
    const foundItem = await FoundItem.findById(req.params.id)

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' })
    }

    if (foundItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this item' })
    }

    if (foundItem.status === 'claimed') {
      return res.status(400).json({ message: 'Claimed items cannot be deleted' })
    }

    await foundItem.deleteOne()

    res.json({ message: 'Found item deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
}