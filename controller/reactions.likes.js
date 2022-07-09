const Auths = require('../models/Auths')
const Posts = require('../models/Posts')
const { Likes } = require('../models/Reactions.js')
const { likeValidation } = require('../validation/reactions')

// Get all likes
const allLikes = async (req, res) => {
  try {
    const likes = await Likes.find()
    if (likes.length < 1)
      return res.status(400).send('No user has likesd this post until now')

    res.send(likes)
  } catch (error) {
    res.send(error)
  }
}

// get single like
const singleLike = async (req, res) => {
  const like_id = req.params.like_id

  try {
    const singleLike = await Likes.findById({ _id: like_id })
    if (!singleLike) return res.status(400).send('No likes with this id')

    res.send(singleLike)
  } catch (error) {
    res.send(error)
  }
}

// Create new like
const createLike = async (req, res) => {
  const { liker_id, post_id } = req.params

  try {
    // validate request send by user
    const { value, error } = likeValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if liker exist in database
    const liker = await Auths.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    // Find the post  in the Posts collection by the id gotten from the user
    const postToBeLiked = await Posts.findById({ _id: post_id })
    if (!postToBeLiked)
      return res.status(400).send('Cannot fetch post at the moment')

    // create new like
    const newLike = new Likes({
      like_type: value.like_type,
      liker_id,
      post_id,
    })

    try {
      const savedLike = await newLike.save()

      const newLikeObjectId = {
        like_id: savedLike._id,
      }

      if (postToBeLiked.likes.length >= 1) {
        await Posts.updateOne(
          { _id: post_id },
          {
            $set: {
              // use the spread operator to add new like to existing coikes in the post
              likes: [...postToBeLiked.likes, newLikeObjectId],
            },
          },
        )
      } else {
        await Posts.updateOne(
          { _id: post_id },
          {
            $set: {
              // use the spread operator to add new like to existing coikes in the post
              likes: [newLikeObjectId],
            },
          },
        )
      }

      res.send(postToBeLiked)
    } catch (error) {
      res.send(error)
    }
  } catch (error) {
    res.send(error)
  }
}

// update specific post
const unlike = async (req, res) => {
  const { post_id, like_id } = req.params

  // validate the like request first
  const { value, error } = likeValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if post_id matches with any post in the database
  const post = await Posts.findOne({ _id: post_id })
  if (!post)
    return res.status(400).send('Post is not available or it has been deleted')

  // Checks if post have any available like
  if (post.likes.length < 1)
    return res.status(400).send('User have no like to edit')

  // find matching like in  post likes array
  const like = post.likes.find((like) => like.like_id == like_id)
  if (!like)
    return res.status(400).send('Like reaction is not available for this post')

  // Find like in Like collection by like_id
  const likeToBeUpdated = await Likes.findOne({ _id: like_id })
  if (!likeToBeUpdated)
    return res.status(400).send('Cannot fetch like at the moment')

  try {
    const updatedLike = await Likes.updateOne(
      { _id: post.post_id },
      {
        $set: {
          like: value.like,
        },
      },
    )

    res.send(updatedLike)
  } catch (error) {
    res.send(error)
  }
}
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
//   const likeToBeUpdated = await Likes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await Likes.updateOne(
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

// delete post
const deleteLike = async (req, res) => {
  const { liker_id, like_id } = req.params

  // check if liker exist in database
  const liker = await Auths.findById({ _id: liker_id })
  if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

  const likeToBeDeleted = await Likes.findById({ _id: like_id })
  if (!likeToBeDeleted) return res.status(400).send('No likes with this id')

  if (likeToBeDeleted.liker_id !== liker_id)
    return res.status(400).send(`User can't delete like they didin't create`)

  const { post_id } = likeToBeDeleted

  const likePost = await Posts.findById({ _id: post_id })
  if (!likePost)
    return res.status(400).send('No post available post with this id')

  try {
    // Delete like from Likes collection
    await Likes.deleteOne({ _id: post_id })

    // filter out the deleted like and leave the remaing like(s) available
    const otherLikes = likePost.likes.filter((like) => like.like_id !== like_id)

    // update user posts array
    await Posts.updateOne(
      { _id: post_id },
      {
        $set: {
          likes: otherLikes,
        },
      },
    )

    res.send('user successfully unliked this post')
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allLikes,
  createLike,
  singleLike,
  unlike,
  deleteLike,
}
