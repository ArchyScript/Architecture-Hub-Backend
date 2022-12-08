const mongoose = require('mongoose')

const PostCommentSchema = new mongoose.Schema(
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
    post_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const PostLikesSchema = new mongoose.Schema(
  {
    like_type: {
      type: String,
      required: true,
    },
    liker_id: {
      type: String,
      required: true,
    },
    post_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const PostComments = mongoose.model('PostComments', PostCommentSchema)
const PostLikes = mongoose.model('PostLikes', PostLikesSchema)

module.exports = { PostComments, PostLikes }
