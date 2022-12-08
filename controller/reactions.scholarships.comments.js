const Users = require('../models/Users')
// const Auths = require('../models/Auths')
const { ScholarshipComments } = require('../models/Reactions.Scholarships')
const Scholarships = require('../models/Scholarships')
const { commentValidation } = require('../validation/reactions')

// Get all comments
const allScholarshipsComments = async (req, res) => {
  try {
    const comments = await (await ScholarshipComments.find()).reverse()
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
const singleScholarshipComment = async (req, res) => {
  const { comment_id } = req.params

  try {
    const singleScholarshipComment = await ScholarshipComments.findById({
      _id: comment_id,
    })
    if (!singleScholarshipComment)
      return res.status(400).send('No comments with this id')

    res.send(singleScholarshipComment)
  } catch (error) {
    res.send(error)
  }
}

// Create new comment
const newScholarshipComment = async (req, res) => {
  const { commenter_id, scholarship_id } = req.params

  try {
    const { value, error } = commentValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const scholarshipToCommentOn = await Scholarships.findById({
      _id: scholarship_id,
    })
    if (!scholarshipToCommentOn)
      return res.status(400).send('Cannot fetch scholarship at the moment')

    // create new comment
    const newScholarshipComment = new ScholarshipComments({
      comment: value.comment,
      commenter_id,
      edited: false,
      scholarship_id,
    })

    const savedComment = await newScholarshipComment.save()

    const newCommentObjectId = {
      comment_id: savedComment._id,
    }

    if (scholarshipToCommentOn.comments.length >= 1) {
      await Scholarships.updateOne(
        { _id: scholarship_id },
        {
          $set: {
            comments: [...scholarshipToCommentOn.comments, newCommentObjectId],
          },
        },
      )
    } else {
      await Scholarships.updateOne(
        { _id: scholarship_id },
        {
          $set: {
            comments: [newCommentObjectId],
          },
        },
      )
    }

    res.send(
      `${commenter.username} just added a new comment to your scholarship`,
    )
  } catch (error) {
    res.send(error)
  }
}

// update comment
const updateScholarshipComment = async (req, res) => {
  const { scholarship_id, comment_id } = req.params

  // validate the comment request first
  const { value, error } = commentValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if scholarship_id matches with any scholarship in the database
  const scholarship = await Scholarships.findOne({ _id: scholarship_id })
  if (!scholarship)
    return res
      .status(400)
      .send('Scholarship is not available or it has been deleted')

  // Checks if scholarship have any available comment
  if (scholarship.comments.length < 1)
    return res.status(400).send('User have no comment to edit')

  // find matching comment in  scholarship comments array
  const comment = scholarship.comments.find(
    (comment) => comment.comment_id == comment_id,
  )
  if (!comment)
    return res.status(400).send('Comment is not available for this scholarship')

  // Find comment in Comment collection by comment_id
  const commentToBeUpdated = await ScholarshipComments.findOne({
    _id: comment_id,
  })
  if (!commentToBeUpdated)
    return res.status(400).send('Cannot fetch comment at the moment')

  try {
    const updatedComment = await ScholarshipComments.updateOne(
      { _id: scholarship.scholarship_id },
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

// delete scholarship
const deleteScholarshipComment = async (req, res) => {
  const { commenter_id, comment_id } = req.params

  try {
    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const commentToDelete = await ScholarshipComments.findById({
      _id: comment_id,
    })
    if (!commentToDelete)
      return res.status(400).send('No comments with this id')

    if (commentToDelete.commenter_id !== commenter_id)
      return res
        .status(400)
        .send(`${commenter.username}, you cannot delete this comment`)

    const { scholarship_id } = commentToDelete

    const commentScholarship = await Scholarships.findById({
      _id: scholarship_id,
    })
    if (!commentScholarship)
      return res.status(400).send('This scholarship is not available')

    // Delete comment
    await ScholarshipComments.deleteOne({ _id: comment_id })

    // filter out the deleted comment and keep the remaining comment(s) available
    const otherComments = commentScholarship.comments.filter(
      (comment) => comment.comment_id !== comment_id,
    )

    // update user scholarships array
    await Scholarships.updateOne(
      { _id: scholarship_id },
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
  allScholarshipsComments,
  newScholarshipComment,
  singleScholarshipComment,
  // updateScholarshipComment,
  deleteScholarshipComment,
}
