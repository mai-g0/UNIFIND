const mongoose = require('mongoose')

const foundItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    foundLocation: {
      type: String,
      required: true,
    },

    dateFound: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['open', 'matched', 'claimed', 'returned', 'closed'],
      default: 'open',
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('FoundItem', foundItemSchema)