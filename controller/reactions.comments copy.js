const Auths = require('../models/Auths')
const { Comments } = require('../models/Reactions')
const Posts = require('../models/Posts')

const { commentValidation } = require('../validation/reactions')

// Get all comments
const allComments = async (req, res) => {
  try {
    const comments = await Comments.find()
    if (comments.length < 1)
      return res
        .status(400)
        .send('No comments has been written yet, be the first to comment')

    res.send(comments)
  } catch (error) {
    res.send(error)
  }
}

// Create new comment
const createComment = async (req, res) => {
  const { commenter_id, post_id } = req.params

  try {
    // validate request send by user
    const { value, error } = commentValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // check if commenter exist in database
    const commenter = await Auths.findOne({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    // Find the post  in the Posts collection by the id gotten from the user
    const postToBeCommentedOn = await Posts.findOne({ _id: post_id })
    if (!postToBeCommentedOn)
      return res.status(400).send('Cannot fetch post at the moment')

    // create new comment
    const newComment = new Comments({
      comment: value.comment,
      post_id,
      commenter_id,
    })

    try {
      const savedComment = await newComment.save()

      // get the id of the newly added comment
      const newCommentObjectId = {
        comment_id: savedComment._id,
      }

      const updatePostsCommentsArray = await Posts.updateOne(
        { user_id: commenter_id },
        {
          $set: {
            // use the spread operator to add new comment to existing coomments in the post
            comments: [newCommentObjectId],
          },
        },
      )

      res.send(updatePostsCommentsArray)
    } catch (error) {
      res.send(error)
    }
  } catch (error) {
    res.send(error)
  }
}

// get single comment
const singleComment = async (req, res) => {
  const comment_id = req.params.comment_id

  try {
    const singleComment = await Comments.findById({ _id: comment_id })
    if (!singleComment) return res.status(400).send('No comments with this id')

    res.send(singleComment)
  } catch (error) {
    res.send(error)
  }
}

// update specific post
const updateComment = async (req, res) => {
  const { post_id, comment_id } = req.params

  // validate the comment request first
  const { value, error } = commentValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if post_id matches with any post in the database
  const post = await Posts.findOne({ _id: post_id })
  if (!post)
    return res.status(400).send('Post is not available or it has been deleted')

  // Checks if post have any available comment
  if (post.comments.length < 1)
    return res.status(400).send('User have no comment to edit')

  // find matching comment in  post comments array
  const comment = post.comments.find(
    (comment) => comment.comment_id == comment_id,
  )
  if (!comment)
    return res.status(400).send('Comment is not available for this post')

  // Find comment in Comment collection by comment_id
  const commentToBeUpdated = await Comments.findOne({ _id: comment_id })
  if (!commentToBeUpdated)
    return res.status(400).send('Cannot fetch comment at the moment')

  try {
    const updatedComment = await Comments.updateOne(
      { _id: post.post_id },
      {
        $set: {
          comment: value.comment,
          edited: true,
        },
      },
    )

    res.send(updatedComment)
  } catch (error) {
    res.send(error)
  }
}

// delete post
const deleteComment = async (req, res) => {
  const { commenter_id, post_id } = req.params

  // check if user id matches with the "commenter_id" in the database
  const user = await Auths.findOne({ commenter_id })
  if (!user) return res.status(400).send('Cannot fetch data of invalid user')
  // Checks if user have any post in their name
  if (user.posts.length < 1)
    return res.status(400).send('User have no post to delete')

  // Checks if user created this post
  const filteredPost = user.posts.find((post) => post.post_id == post_id)
  if (!filteredPost)
    return res.status(400).send('User did not create this post')

  // filter out the deleted post and kep the remaing post(s) available
  const otherPosts = user.posts.filter((post) => post !== filteredPost)

  // Find the post  in the Comments collection by the id gotten from the user
  // const postToBeDeleted = await Comments.findOne({ _id: filteredPost.post_id })
  // if (!postToBeDeleted)
  //     return res
  //         .status(400)
  //         .send('Cannot fetch post from collection at the moment')

  try {
    // Delete post from Comments collection
    await Comments.deleteOne({ _id: post_id })

    // update user posts array
    await Auths.updateOne(
      { commenter_id },
      {
        $set: {
          posts: otherPosts,
        },
      },
    )

    res.send('Comments successfully deleted')
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allComments,
  createComment,
  singleComment,
  updateComment,
  deleteComment,
}
