const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

function calculateMatchScore(lostItem, foundItem) {
  let score = 0

  if (lostItem.category === foundItem.category) {
    score += 40
  }

  const lostName = lostItem.itemName.toLowerCase()
  const foundName = foundItem.itemName.toLowerCase()

  if (lostName.includes(foundName) || foundName.includes(lostName)) {
    score += 40
  }

  const lostDescription = lostItem.description.toLowerCase()
  const foundDescription = foundItem.description.toLowerCase()

  if (
    lostDescription.includes(foundName) ||
    foundDescription.includes(lostName)
  ) {
    score += 20
  }

  return score
}

async function getMatches(req, res) {
  try {
    const lostItems = await LostItem.find({ status: 'open' }).sort({ createdAt: -1 })
const foundItems = await FoundItem.find({ status: 'open' }).sort({ createdAt: -1 })

    const matches = []

    lostItems.forEach((lostItem) => {
      foundItems.forEach((foundItem) => {
        const score = calculateMatchScore(lostItem, foundItem)

        if (score >= 40) {
          matches.push({
            id: `${lostItem._id}-${foundItem._id}`,
            lostItemId: lostItem._id,
            foundItemId: foundItem._id,
           lostItem: lostItem.itemName,
           foundItem: foundItem.itemName,
           lostImage: lostItem.image,
           foundImage: foundItem.image,
           category: lostItem.category,
           location: foundItem.foundLocation,
           matchScore: `${score}%`,
           status: score >= 80 ? 'Strong Match' : 'Possible Match',
          })
        }
      })
    })

    res.json(matches)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getMatches,
}