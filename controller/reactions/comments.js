const Auths = require('../../models/auth/auths')
const { Comments } = require('../../models/reactions/reactions.js')
const Posts = require('../../models/posts/posts')

const { commentValidation } = require('../../validation/reactions/index')

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
  const comment_id = req.params.comment_id

  try {
    const singleComment = await Comments.findById({ _id: comment_id })
    if (!singleComment) return res.status(400).send('No comments with this id')

    res.send(singleComment)
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
    const commenter = await Auths.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    // Find the post  in the Posts collection by the id gotten from the user
    const postToBeCommentedOn = await Posts.findById({ _id: post_id })
    if (!postToBeCommentedOn)
      return res.status(400).send('Cannot fetch post at the moment')

    // create new comment
    const newComment = new Comments({
      comment: value.comment,
      commenter_id,
      edited: false,
      post_id,
    })

    try {
      const savedComment = await newComment.save()

      const newCommentObjectId = {
        comment_id: savedComment._id,
      }

      if (postToBeCommentedOn.comments.length >= 1) {
        await Posts.updateOne(
          { _id: post_id },
          {
            $set: {
              // use the spread operator to add new comment to existing coomments in the post
              comments: [...postToBeCommentedOn.comments, newCommentObjectId],
            },
          },
        )
      } else {
        await Posts.updateOne(
          { _id: post_id },
          {
            $set: {
              // use the spread operator to add new comment to existing coomments in the post
              comments: [newCommentObjectId],
            },
          },
        )
      }

      res.send(postToBeCommentedOn)
    } catch (error) {
      res.send(error)
    }
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
  const { commenter_id, comment_id } = req.params

  // check if commenter exist in database
  const commenter = await Auths.findById({ _id: commenter_id })
  if (!commenter)
    return res.status(400).send('Cannot fetch data of invalid user')

  const commentToBeDeleted = await Comments.findById({ _id: comment_id })
  if (!commentToBeDeleted)
    return res.status(400).send('No comments with this id')

  if (commentToBeDeleted.commenter_id !== commenter_id)
    return res.status(400).send(`User can't delete comment they didin't create`)

  const { post_id } = commentToBeDeleted

  const commentPost = await Posts.findById({ _id: post_id })
  if (!commentPost)
    return res.status(400).send('No post available post with this id')

  try {
    // Delete comment from Comments collection
    await Comments.deleteOne({ _id: post_id })

    // filter out the deleted comment and kep the remaing comment(s) available
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

    res.send('comment successfully deleted')
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
