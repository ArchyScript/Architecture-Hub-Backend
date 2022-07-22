const Users = require('../models/Users')
const Posts = require('../models/Posts')
const { PostLikes } = require('../models/Reactions.Posts.js')
const { likeValidation } = require('../validation/reactions')

// Get all likes
const allPostsLikes = async (req, res) => {
  try {
    const likes = await PostLikes.find()
    if (likes.length < 1)
      return res.status(400).send('No user has liked this post until now')

    res.send(likes)
  } catch (error) {
    res.send(error)
  }
}

// get single like
const singlePostLike = async (req, res) => {
  const like_id = req.params.like_id

  try {
    const singlePostLike = await PostLikes.findById({ _id: like_id })
    if (!singlePostLike) return res.status(400).send('No likes with this id')

    res.send(singlePostLike)
  } catch (error) {
    res.send(error)
  }
}

// Create new like
const newPostLike = async (req, res) => {
  const { liker_id, post_id } = req.params

  const { value, error } = likeValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const postToLike = await Posts.findById({ _id: post_id })
    if (!postToLike)
      return res.status(400).send('Cannot fetch  post at the moment')

    // check if post have been liked before
    const does_post_match_any_like = await PostLikes.findOne({ post_id })
    if (
      does_post_match_any_like &&
      does_post_match_any_like.liker_id === liker_id
    )
      return res
        .status(400)
        .send(`"@${liker.username}", you cannot like a post twice`)

    // create new like
    const newPostLike = new PostLikes({
      like_type: value.like_type,
      liker_id,
      post_id,
    })

    const savedLike = await newPostLike.save()

    const newLikeObjectId = {
      like_id: savedLike._id,
    }

    if (postToLike.likes.length >= 1) {
      await Posts.updateOne(
        { _id: post_id },
        {
          $set: {
            likes: [newLikeObjectId, ...postToLike.likes],
          },
        },
      )
    } else {
      await Posts.updateOne(
        { _id: post_id },
        {
          $set: {
            likes: [newLikeObjectId],
          },
        },
      )
    }

    res.send(`"@${liker.username}", you just liked a post`)
  } catch (error) {
    res.send(error)
  }
}

// update specific post
// const unlike = async (req, res) => {
//   const { post_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if post_id matches with any post in the database
//   const post = await Posts.findOne({ _id: post_id })
//   if (!post)
//     return res.status(400).send('Post is not available or it has been deleted')

//   // Checks if post have any available like
//   if (post.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  post likes array
//   const like = post.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this post')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await PostLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await PostLikes.updateOne(
//       { _id: post.post_id },
//       {
//         $set: {
//           like: value.like,
//         },
//       },
//     )

//     res.send(updatedLike)
//   } catch (error) {
//     res.send(error)
//   }
// }
// // update specific post
// const updateLike = async (req, res) => {
//   const { post_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if post_id matches with any post in the database
//   const post = await Posts.findOne({ _id: post_id })
//   if (!post)
//     return res.status(400).send('Post is not available or it has been deleted')

//   // Checks if post have any available like
//   if (post.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  post likes array
//   const like = post.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this post')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await PostLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await PostLikes.updateOne(
//       { _id: post.post_id },
//       {
//         $set: {
//           like: value.like,
//         },
//       },
//     )

//     res.send(updatedLike)
//   } catch (error) {
//     res.send(error)
//   }
// }

// reverse post
const reversePostLike = async (req, res) => {
  const { liker_id, like_id } = req.params

  try {
    // check if liker exist in database
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const likeToDelete = await PostLikes.findById({ _id: like_id })
    if (!likeToDelete) return res.status(400).send('No likes with this id')

    if (likeToDelete.liker_id !== liker_id)
      return res.status(400).send(`User cannot reverse like`)

    const { post_id } = likeToDelete

    const likePost = await Posts.findById({ _id: post_id })
    if (!likePost) return res.status(400).send('Posts is no more available')

    // Delete like
    await PostLikes.deleteOne({ _id: like_id })

    // filter out the deleted like and leave the remaing like(s) available
    const remainingLikes = likePost.likes.filter(
      (like) => like.like_id !== like_id,
    )

    // update user posts array
    await Posts.updateOne(
      { _id: post_id },
      {
        $set: {
          likes: remainingLikes,
        },
      },
    )

    res.send(`"@${liker.username}" reversed like`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  // allPostsLikes,
  newPostLike,
  // singlePostLike,
  reversePostLike,
}
