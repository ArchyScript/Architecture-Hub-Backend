const Users = require('../models/Users')
const Scholarships = require('../models/Scholarships')
const {
  ScholarshipComments,
  ScholarshipLikes,
} = require('../models/Reactions.Scholarships')
const { scholarshipValidation } = require('../validation/scholarships')
const cloudinary = require('../config/cloudinary')

// Get all scholarships
const allScholarships = async (req, res) => {
  try {
    const scholarships = await (await Scholarships.find()).reverse()
    res.send(scholarships)
  } catch (error) {
    res.send(error)
  }
}

// Create new scholarship
const createScholarship = async (req, res) => {
  if (!req.file) return res.status(400).send('No image selected')

  const request_body = { ...req.body, file_path: req.file.path }
  const { creator_id } = req.params

  const { value, error } = scholarshipValidation(request_body)
  if (error) return res.status(400).send(error.details[0].message)

  const { title, link, host, description, file_path, content } = value

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const result = await cloudinary.uploader.upload(file_path)

    const scholarship_image = {
      title: `${title} scholarship`,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    }

    const newScholarship = new Scholarships({
      scholarship_image,
      title,
      content,
      link,
      host,
      description,
      creator_id,
    })

    // await newScholarship.save()
    const savedScholarship = await newScholarship.save()

    const newScholarshipObject = {
      scholarship_id: savedScholarship._id,
    }

    await Users.updateOne(
      { _id: creator_id },
      {
        $set: {
          scholarships: [...user.scholarships, newScholarshipObject],
        },
      },
    )

    res.send(`new scholarship added`)
    // res.send(`"@${user.username}", you just added a new scholarship`)
  } catch (error) {
    res.send(error)
  }
}

// get specific scholarship
const specificScholarship = async (req, res) => {
  const { scholarship_id } = req.params

  try {
    const specificScholarship = await Scholarships.findOne({
      _id: scholarship_id,
    })
    if (!specificScholarship) return res.status(400).send('Invalid request')

    res.send(specificScholarship)
  } catch (error) {
    res.send(error)
  }
}

// update scholarship
const updateScholarship = async (req, res) => {
  const { scholarship_id, creator_id } = req.params

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const scholarship = await Scholarships.findOne({ _id: scholarship_id })
    if (!scholarship)
      return res.status(400).send('Cannot fetch data of invalid user')

    if (scholarship.creator_id !== creator_id)
      return res
        .status(400)
        .send(`"@${user.username}", you cannot update scholarship`)

    const { title, link, host, description, content } = req.body

    await Scholarships.updateOne(
      { _id: scholarship_id },
      {
        $set: {
          title,
          content,
          link,
          host,
          description,
        },
      },
    )

    res.send(`scholarship updated`)
    // res.send(`"@${user.username}", you successfully updated scholarship`)
  } catch (error) {
    res.send(error)
  }
}

// delete specific scholarship
const deleteScholarship = async (req, res) => {
  const { scholarship_id, creator_id } = req.params

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const scholarship = await Scholarships.findOne({ _id: scholarship_id })
    if (!scholarship)
      return res.status(400).send('Cannot fetch data of invalid scholarship')

    // Checks if user have any scholarship
    if (user.scholarships && user.scholarships.length < 1)
      return res
        .status(400)
        .send(`Hi "@${user.username}",  you have no scholarship to delete'`)

    let did_user_create_this_scholarship = false
    const otherScholarships = []

    // Checks if user created this scholarship
    user.scholarships.forEach((scholarship) => {
      if (scholarship.scholarship_id === scholarship_id) {
        did_user_create_this_scholarship = true
      } else {
        if (scholarship.scholarship_id !== '') {
          otherScholarships.push(scholarship)
        }
      }
    })

    if (!did_user_create_this_scholarship)
      return res
        .status(400)
        .send(`Hi "@${user.username}", you did not create this scholarship`)

    //
    if (scholarship.scholarship_image.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(
        scholarship.scholarship_image.cloudinary_id,
      )
    }

    // delete comments related to scholarship
    if (scholarship.comments && scholarship.comments.length >= 1) {
      scholarship.comments.forEach(async (each_scholarship_comment) => {
        const { comment_id } = each_scholarship_comment
        await ScholarshipComments.deleteOne({ _id: comment_id })
      })
    }
    // delete likes related to scholarship
    if (scholarship.likes && scholarship.likes.length >= 1) {
      scholarship.likes.forEach(async (each_scholarship_like) => {
        const { like_id } = each_scholarship_like
        await ScholarshipLikes.deleteOne({ _id: like_id })
      })
    }

    //
    await Scholarships.deleteOne({
      _id: scholarship_id,
    })

    // update user scholarships array
    await Users.updateOne(
      { _id: creator_id },
      {
        $set: {
          scholarships: otherScholarships,
        },
      },
    )
    res.send(`scholarship deleted`)
    // res.send(`"@${user.username}", you successfully deleted scholarship`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allScholarships,
  specificScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
}
