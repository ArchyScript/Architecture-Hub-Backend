const Users = require('../models/Users')
const Scholarships = require('../models/Scholarships')
const { scholarshipValidation } = require('../validation/scholarships')
const cloudinary = require('../config/cloudinary')

// Get all scholarships
const allScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarships.find()
    res.send(scholarships)
  } catch (error) {
    res.send(error)
  }
}

// Create new scholarship
const createScholarship = async (req, res) => {
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
      competition_id: savedScholarship._id,
    }

    await Users.updateOne(
      { _id: creator_id },
      {
        $set: {
          scholarships: [...user.scholarships, newScholarshipObject],
        },
      },
    )
    res.send(`"@${user.username}", you just added a new scholarship`)
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

    res.send(`"@${user.username}", you successfully updated scholarship`)
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
      return res.status(400).send('Cannot fetch data of invalid user')

    if (scholarship.creator_id !== creator_id)
      return res
        .status(400)
        .send(`"@${user.username}", you cannot delete scholarship`)

    if (scholarship.scholarship_image.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(
        scholarship.scholarship_image.cloudinary_id,
      )
    }

    await Scholarships.deleteOne({
      _id: scholarship_id,
    })

    res.send(`"@${user.username}", you successfully deleted scholarship`)
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
