const mongoose = require('mongoose')

const BookmarkSchema = new mongoose.Schema(
  {
    post_id: {
      type: String,
      required: true,
    },
    post_type: {
      type: String,
      required: true,
    },
    poster_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const Bookmarks = mongoose.model('Bookmarks', BookmarkSchema)
module.exports = Bookmarks
