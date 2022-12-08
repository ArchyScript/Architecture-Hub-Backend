// const mongoose = require('mongoose')

// const CommentSchema = new mongoose.Schema(
//   {
//     comment: {
//       type: String,
//       required: true,
//     },
//     edited: {
//       type: Boolean,
//       default: false,
//     },
//     commenter_id: {
//       type: String,
//       required: true,
//     },
//     post_id: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true },
// )

// const LikesSchema = new mongoose.Schema(
//   {
//     like_type: {
//       type: String,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     user_id: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true },
// )

// const Comments = mongoose.model('Comments', CommentSchema)
// const Likes = mongoose.model('Likes', LikesSchema)

// module.exports = { Comments, Likes }
