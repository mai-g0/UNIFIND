const Message = require('../models/Message')

async function createMessage(req, res) {
  try {
    const { receiver, itemName, content } = req.body

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      itemName,
      content,
    })

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getMessages(req, res) {
  try {
    const messages = await Message.find({
  $or: [{ sender: req.user._id }, { receiver: req.user._id }],
})
  .populate('sender', 'fullName email role')
  .populate('receiver', 'fullName email role')
  .sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createMessage,
  getMessages,
}