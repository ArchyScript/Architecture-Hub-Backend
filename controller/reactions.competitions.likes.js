const Users = require('../models/Users')
const Competitions = require('../models/Competitions')
const { CompetitionLikes } = require('../models/Reactions.Competitions')
const { likeValidation } = require('../validation/reactions')

// Get all likes
const allCompetitionsLikes = async (req, res) => {
  try {
    const likes = await CompetitionLikes.find()
    if (likes.length < 1) return res.status(400).send('Noliked competition')

    res.send(likes)
  } catch (error) {
    res.send(error)
  }
}

// get single like
const singleCompetitionLike = async (req, res) => {
  const like_id = req.params.like_id

  try {
    const singleCompetitionLike = await CompetitionLikes.findById({
      _id: like_id,
    })
    if (!singleCompetitionLike)
      return res.status(400).send('No likes with this id')

    res.send(singleCompetitionLike)
  } catch (error) {
    res.send(error)
  }
}

// Create new like
const newCompetitionLike = async (req, res) => {
  const { liker_id, competition_id } = req.params

  const { value, error } = likeValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const competitionToLike = await Competitions.findById({
      _id: competition_id,
    })
    if (!competitionToLike)
      return res.status(400).send('Cannot fetch  competition at the moment')

    // check if competition have been liked before
    const does_competition_match_any_like = await CompetitionLikes.findOne({
      competition_id,
    })
    if (
      does_competition_match_any_like &&
      does_competition_match_any_like.liker_id === liker_id
    )
      return res
        .status(400)
        .send(`"@${liker.username}", you cannot like a competition twice`)

    // create new like
    const newCompetitionLike = new CompetitionLikes({
      like_type: value.like_type,
      liker_id,
      competition_id,
    })

    const savedLike = await newCompetitionLike.save()

    const newLikeObjectId = {
      like_id: savedLike._id,
    }

    if (competitionToLike.likes.length >= 1) {
      await Competitions.updateOne(
        { _id: competition_id },
        {
          $set: {
            likes: [...competitionToLike.likes, newLikeObjectId],
          },
        },
      )
    } else {
      await Competitions.updateOne(
        { _id: competition_id },
        {
          $set: {
            likes: [newLikeObjectId],
          },
        },
      )
    }

    res.send(`"@${liker.username}", you just liked a competition`)
  } catch (error) {
    res.send(error)
  }
}

// update specific competition
// const unlike = async (req, res) => {
//   const { competition_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if competition_id matches with any competition in the database
//   const competition = await Competitions.findOne({ _id: competition_id })
//   if (!competition)
//     return res.status(400).send('Competition is not available or it has been deleted')

//   // Checks if competition have any available like
//   if (competition.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  competition likes array
//   const like = competition.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this competition')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await CompetitionLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await CompetitionLikes.updateOne(
//       { _id: competition.competition_id },
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
// // update specific competition
// const updateLike = async (req, res) => {
//   const { competition_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if competition_id matches with any competition in the database
//   const competition = await Competitions.findOne({ _id: competition_id })
//   if (!competition)
//     return res.status(400).send('Competition is not available or it has been deleted')

//   // Checks if competition have any available like
//   if (competition.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  competition likes array
//   const like = competition.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this competition')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await CompetitionLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await CompetitionLikes.updateOne(
//       { _id: competition.competition_id },
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

// reverse competition
const reverseCompetitionLike = async (req, res) => {
  const { liker_id, like_id } = req.params

  try {
    // check if liker exist in database
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const likeToDelete = await CompetitionLikes.findById({ _id: like_id })
    if (!likeToDelete) return res.status(400).send('No likes with this id')

    if (likeToDelete.liker_id !== liker_id)
      return res.status(400).send(`User cannot reverse like`)

    const { competition_id } = likeToDelete

    const likeCompetition = await Competitions.findById({ _id: competition_id })
    if (!likeCompetition)
      return res.status(400).send('Competitions is no more available')

    // Delete like
    await CompetitionLikes.deleteOne({ _id: like_id })

    // filter out the deleted like and leave the remaing like(s) available
    const remainingLikes = likeCompetition.likes.filter(
      (like) => like.like_id !== like_id,
    )

    // update user competitions array
    await Competitions.updateOne(
      { _id: competition_id },
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
  allCompetitionsLikes,
  newCompetitionLike,
  // singleCompetitionLike,
  reverseCompetitionLike,
}
