const Notification = require('../models/Notification')

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function markNotificationRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    )

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
}