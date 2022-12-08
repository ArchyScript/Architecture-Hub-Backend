const mongoose = require('mongoose')

const CompetitionCommentSchema = new mongoose.Schema(
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
    competition_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const CompetitionLikesSchema = new mongoose.Schema(
  {
    like_type: {
      type: String,
      required: true,
    },
    liker_id: {
      type: String,
      required: true,
    },
    competition_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const CompetitionComments = mongoose.model(
  'CompetitionComments',
  CompetitionCommentSchema,
)
const CompetitionLikes = mongoose.model(
  'CompetitionLikes',
  CompetitionLikesSchema,
)

module.exports = { CompetitionComments, CompetitionLikes }
