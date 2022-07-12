const mongoose = require('mongoose')

const CompetitionSchema = new mongoose.Schema(
  {
    competition_image: {
      title: {
        type: String,
        default: '',
      },
      cloudinary_id: {
        type: String,
        default: '',
      },
      avatar: {
        type: String,
        default: '',
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
      required: true,
    },
    host: {
      type: String,
      default: '',
      required: true,
    },
    description: {
      type: String,
      default: '',
      required: true,
    },
    creator_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Competitions', CompetitionSchema)
