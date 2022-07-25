const Users = require('../models/Users')
// const Auths = require('../models/Auths')
const Scholarships = require('../models/Scholarships')
const { ScholarshipLikes } = require('../models/Reactions.Scholarships')
const { likeValidation } = require('../validation/reactions')

// Get all likes
const allScholarshipsLikes = async (req, res) => {
  try {
    const likes = await ScholarshipLikes.find()
    if (likes.length < 1) return res.status(400).send('No liked scholarship')

    res.send(likes)
  } catch (error) {
    res.send(error)
  }
}

// get single like
const singleScholarshipLike = async (req, res) => {
  const like_id = req.params.like_id

  try {
    const singleScholarshipLike = await ScholarshipLikes.findById({
      _id: like_id,
    })
    if (!singleScholarshipLike)
      return res.status(400).send('No likes with this id')

    res.send(singleScholarshipLike)
  } catch (error) {
    res.send(error)
  }
}

// Create new like
const newScholarshipLike = async (req, res) => {
  const { liker_id, scholarship_id } = req.params

  const { value, error } = likeValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const scholarshipToLike = await Scholarships.findById({
      _id: scholarship_id,
    })
    if (!scholarshipToLike)
      return res.status(400).send('Cannot fetch  scholarship at the moment')

    // check if scholarship have been liked before
    const does_scholarship_match_any_like = await ScholarshipLikes.findOne({
      scholarship_id,
    })
    if (
      does_scholarship_match_any_like &&
      does_scholarship_match_any_like.liker_id === liker_id
    )
      return res
        .status(400)
        .send(`"@${liker.username}", you cannot like a scholarship twice`)

    // create new like
    const newScholarshipLike = new ScholarshipLikes({
      like_type: value.like_type,
      liker_id,
      scholarship_id,
    })

    const savedLike = await newScholarshipLike.save()

    const newLikeObjectId = {
      like_id: savedLike._id,
    }

    if (scholarshipToLike.likes.length >= 1) {
      await Scholarships.updateOne(
        { _id: scholarship_id },
        {
          $set: {
            likes: [...scholarshipToLike.likes, newLikeObjectId],
          },
        },
      )
    } else {
      await Scholarships.updateOne(
        { _id: scholarship_id },
        {
          $set: {
            likes: [newLikeObjectId],
          },
        },
      )
    }

    res.send(`"@${liker.username}", you just liked a scholarship`)
  } catch (error) {
    res.send(error)
  }
}

// update specific scholarship
// const unlike = async (req, res) => {
//   const { scholarship_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if scholarship_id matches with any scholarship in the database
//   const scholarship = await Scholarships.findOne({ _id: scholarship_id })
//   if (!scholarship)
//     return res.status(400).send('Scholarship is not available or it has been deleted')

//   // Checks if scholarship have any available like
//   if (scholarship.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  scholarship likes array
//   const like = scholarship.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this scholarship')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await ScholarshipLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await ScholarshipLikes.updateOne(
//       { _id: scholarship.scholarship_id },
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
// // update specific scholarship
// const updateLike = async (req, res) => {
//   const { scholarship_id, like_id } = req.params

//   // validate the like request first
//   const { value, error } = likeValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   // check if scholarship_id matches with any scholarship in the database
//   const scholarship = await Scholarships.findOne({ _id: scholarship_id })
//   if (!scholarship)
//     return res.status(400).send('Scholarship is not available or it has been deleted')

//   // Checks if scholarship have any available like
//   if (scholarship.likes.length < 1)
//     return res.status(400).send('User have no like to edit')

//   // find matching like in  scholarship likes array
//   const like = scholarship.likes.find((like) => like.like_id == like_id)
//   if (!like)
//     return res.status(400).send('Like reaction is not available for this scholarship')

//   // Find like in Like collection by like_id
//   const likeToBeUpdated = await ScholarshipLikes.findOne({ _id: like_id })
//   if (!likeToBeUpdated)
//     return res.status(400).send('Cannot fetch like at the moment')

//   try {
//     const updatedLike = await ScholarshipLikes.updateOne(
//       { _id: scholarship.scholarship_id },
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

// reverse scholarship
const reverseScholarshipLike = async (req, res) => {
  const { liker_id, like_id } = req.params

  try {
    // check if liker exist in database
    const liker = await Users.findById({ _id: liker_id })
    if (!liker) return res.status(400).send('Cannot fetch data of invalid user')

    const likeToDelete = await ScholarshipLikes.findById({ _id: like_id })
    if (!likeToDelete) return res.status(400).send('No likes with this id')

    if (likeToDelete.liker_id !== liker_id)
      return res.status(400).send(`User cannot reverse like`)

    const { scholarship_id } = likeToDelete

    const likeScholarship = await Scholarships.findById({ _id: scholarship_id })
    if (!likeScholarship)
      return res.status(400).send('Scholarships is no more available')

    // Delete like
    await ScholarshipLikes.deleteOne({ _id: like_id })

    // filter out the deleted like and leave the remaing like(s) available
    const remainingLikes = likeScholarship.likes.filter(
      (like) => like.like_id !== like_id,
    )

    // update user scholarship array
    await Scholarships.updateOne(
      { _id: scholarship_id },
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
  allScholarshipsLikes,
  newScholarshipLike,
  // singleScholarshipLike,
  reverseScholarshipLike,
}
