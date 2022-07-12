// const Post = require('../models/Posts')
// const { postWithoutImageValidation } = require('../validation/posts')

// // Get all posts
// const allPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//     res.send(posts)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // Create new post
// const createPost = async (req, res) => {
//   const { value, error } = postWithoutImageValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // try {
//   //     if (!error) {
//   //         res.send(value)
//   //     } else res.send(error.details[0].message)
//   // } catch (err) {
//   //     res.send(err)
//   // }

//   // value === req.body
//   const newPost = new Post({
//     title: req.body.title,
//     content: req.body.content,
//     no_of_likes: req.body.no_of_likes,
//     no_of_comments: req.body.no_of_comments,
//     people_engages_in_post: req.body.people_engages_in_post,
//   })

//   try {
//     const savedPost = await newPost.save()
//     res.send(savedPost)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // get specific post
// const specificPost = async (req, res) => {
//   const post_Id = req.params.post_id
//   try {
//     const specificPost = await Post.findById(post_Id)
//     res.send(specificPost)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // update specific post
// const updatePost = async (req, res) => {
//   const post_Id = req.params.post_id

//   // const updatePostValue = {
//   //     title: req.body.title
//   // }
//   try {
//     const updatedPost = await Post.updateOne(
//       { _id: post_Id },
//       {
//         $set: {
//           title: req.body.title,
//         },
//       },
//     )

//     res.send(updatedPost)
//     // res.send(`post with id "${post_Id}" has been updated`)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // delete specific post
// const deletePost = async (req, res) => {
//   const post_Id = req.params.post_id
//   try {
//     const deletedPost = await Post.remove({ _id: post_Id })
//     res.send(deletedPost)
//   } catch (error) {
//     res.send(error)
//   }
// }

// module.exports = { allPosts, createPost, specificPost, updatePost, deletePost }
