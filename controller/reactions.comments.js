const Users = require('../models/Users')
// const Auths = require('../models/Auths')
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

// get single comment
const singleComment = async (req, res) => {
  const { comment_id } = req.params

  try {
    const singleComment = await Comments.findById({ _id: comment_id })
    if (!singleComment) return res.status(400).send('No comments with this id')

    res.send(singleComment)
  } catch (error) {
    res.send(error)
  }
}

// Create new comment
const newComment = async (req, res) => {
  const { commenter_id, post_id } = req.params

  try {
    const { value, error } = commentValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const postToCommentOn = await Posts.findById({ _id: post_id })
    if (!postToCommentOn)
      return res.status(400).send('Cannot fetch post at the moment')

    // create new comment
    const newComment = new Comments({
      comment: value.comment,
      commenter_id,
      edited: false,
      post_id,
    })

    const savedComment = await newComment.save()

    const newCommentObjectId = {
      comment_id: savedComment._id,
    }

    if (postToCommentOn.comments.length >= 1) {
      await Posts.updateOne(
        { _id: post_id },
        {
          $set: {
            comments: [...postToCommentOn.comments, newCommentObjectId],
          },
        },
      )
    } else {
      await Posts.updateOne(
        { _id: post_id },
        {
          $set: {
            comments: [newCommentObjectId],
          },
        },
      )
    }

    res.send(`${commenter.username} just added a new comment to your post`)
  } catch (error) {
    res.send(error)
  }
}

// update comment
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
  const { commenter_id, comment_id } = req.params

  try {
    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const commentToDelete = await Comments.findById({ _id: comment_id })
    if (!commentToDelete)
      return res.status(400).send('No comments with this id')

    if (commentToDelete.commenter_id !== commenter_id)
      return res
        .status(400)
        .send(`${commenter.username}, you cannot delete this comment`)

    const { post_id } = commentToDelete

    const commentPost = await Posts.findById({ _id: post_id })
    if (!commentPost) return res.status(400).send('This post is not available')

    // Delete comment
    await Comments.deleteOne({ _id: comment_id })

    // filter out the deleted comment and keep the remaining comment(s) available
    const otherComments = commentPost.comments.filter(
      (comment) => comment.comment_id !== comment_id,
    )

    // update user posts array
    await Posts.updateOne(
      { _id: post_id },
      {
        $set: {
          comments: otherComments,
        },
      },
    )

    res.send(`"@${commenter.username}", you just deleted your comment`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allComments,
  newComment,
  singleComment,
  updateComment,
  deleteComment,
}
