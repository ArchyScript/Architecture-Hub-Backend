const Users = require('../models/Users')
const { CompetitionComments } = require('../models/Reactions.Competitions')
const Competitions = require('../models/Competitions')
const { commentValidation } = require('../validation/reactions')

// Get all comments
const allCompetitionsComments = async (req, res) => {
  try {
    const comments = await CompetitionComments.find()
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
const singleCompetitionComment = async (req, res) => {
  const { comment_id } = req.params

  try {
    const singleCompetitionComment = await CompetitionComments.findById({
      _id: comment_id,
    })
    if (!singleCompetitionComment)
      return res.status(400).send('No comments with this id')

    res.send(singleCompetitionComment)
  } catch (error) {
    res.send(error)
  }
}

// Create new comment
const newCompetitionComment = async (req, res) => {
  const { commenter_id, competition_id } = req.params

  try {
    const { value, error } = commentValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const competitionToCommentOn = await Competitions.findById({
      _id: competition_id,
    })
    if (!competitionToCommentOn)
      return res.status(400).send('Cannot fetch competition at the moment')

    // create new comment
    const newCompetitionComment = new CompetitionComments({
      comment: value.comment,
      commenter_id,
      edited: false,
      competition_id,
    })

    const savedComment = await newCompetitionComment.save()

    const newCommentObjectId = {
      comment_id: savedComment._id,
    }

    if (competitionToCommentOn.comments.length >= 1) {
      await Competitions.updateOne(
        { _id: competition_id },
        {
          $set: {
            comments: [newCommentObjectId, ...competitionToCommentOn.comments],
          },
        },
      )
    } else {
      await Competitions.updateOne(
        { _id: competition_id },
        {
          $set: {
            comments: [newCommentObjectId],
          },
        },
      )
    }

    res.send(
      `${commenter.username} just added a new comment to your competition`,
    )
  } catch (error) {
    res.send(error)
  }
}

// update comment
const updateCompetitionComment = async (req, res) => {
  const { competition_id, comment_id } = req.params

  // validate the comment request first
  const { value, error } = commentValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if competition_id matches with any competition in the database
  const competition = await Competitions.findOne({ _id: competition_id })
  if (!competition)
    return res
      .status(400)
      .send('Competition is not available or it has been deleted')

  // Checks if competition have any available comment
  if (competition.comments.length < 1)
    return res.status(400).send('User have no comment to edit')

  // find matching comment in  competition comments array
  const comment = competition.comments.find(
    (comment) => comment.comment_id == comment_id,
  )
  if (!comment)
    return res.status(400).send('Comment is not available for this competition')

  // Find comment in Comment collection by comment_id
  const commentToBeUpdated = await CompetitionComments.findOne({
    _id: comment_id,
  })
  if (!commentToBeUpdated)
    return res.status(400).send('Cannot fetch comment at the moment')

  try {
    const updatedComment = await CompetitionComments.updateOne(
      { _id: competition.competition_id },
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

// delete competition
const deleteCompetitionComment = async (req, res) => {
  const { commenter_id, comment_id } = req.params

  try {
    const commenter = await Users.findById({ _id: commenter_id })
    if (!commenter)
      return res.status(400).send('Cannot fetch data of invalid user')

    const commentToDelete = await CompetitionComments.findById({
      _id: comment_id,
    })
    if (!commentToDelete) return res.status(400).send('No comments found')

    if (commentToDelete.commenter_id !== commenter_id)
      return res
        .status(400)
        .send(`${commenter.username}, you cannot delete this comment`)

    const { competition_id } = commentToDelete

    const commentCompetition = await Competitions.findById({
      _id: competition_id,
    })
    if (!commentCompetition)
      return res.status(400).send('This competition is not available')

    // Delete comment
    await CompetitionComments.deleteOne({ _id: comment_id })

    // filter out the deleted comment and keep the remaining comment(s) available
    const otherComments = commentCompetition.comments.filter(
      (comment) => comment.comment_id !== comment_id,
    )

    // update user competition array
    await Competitions.updateOne(
      { _id: competition_id },
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
  allCompetitionsComments,
  newCompetitionComment,
  singleCompetitionComment,
  // updateCompetitionComment,
  deleteCompetitionComment,
}
