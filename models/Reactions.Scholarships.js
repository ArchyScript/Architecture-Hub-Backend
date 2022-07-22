const mongoose = require('mongoose')

const ScholarshipCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    commenter_id: {
      type: String,
      required: true,
    },
    scholarship_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const ScholarshipLikesSchema = new mongoose.Schema(
  {
    like_type: {
      type: String,
      required: true,
    },
    liker_id: {
      type: String,
      required: true,
    },
    scholarship_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const ScholarshipComments = mongoose.model(
  'ScholarshipComments',
  ScholarshipCommentSchema,
)
const ScholarshipLikes = mongoose.model(
  'ScholarshipLikes',
  ScholarshipLikesSchema,
)

module.exports = { ScholarshipComments, ScholarshipLikes }
