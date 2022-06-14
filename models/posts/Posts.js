const mongoose = require('mongoose')
const Schema = mongoose.Schema

const comments = new Schema(
  {
    comment_id: {
      type: String,
      required: [true, 'comment_id is required'],
    },
  },
  {
    _id: false,
  },
)

const likes = new Schema(
  {
    like_id: {
      type: String,
      required: [true, 'like_id is required'],
    },
  },
  {
    _id: false,
  },
)

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: String,
      required: true,
    },
    comments: [comments],
    likes: [likes],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Posts', PostSchema)
