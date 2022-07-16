const Users = require('../models/Users')
const Competitions = require('../models/Competitions')
const { competitionValidation } = require('../validation/competitions')
const cloudinary = require('../config/cloudinary')

// Get all competitions
const allCompetitions = async (req, res) => {
  try {
    const competitions = await Competitions.find()
    res.send(competitions)
  } catch (error) {
    res.send(error)
  }
}

// Create new competition
const createCompetition = async (req, res) => {
  if (!req.file) return res.status(400).send('No image selected')

  const request_body = { ...req.body, file_path: req.file.path }
  const { creator_id } = req.params

  const { value, error } = competitionValidation(request_body)
  if (error) return res.status(400).send(error.details[0].message)

  const { title, link, host, description, file_path, content } = value

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const result = await cloudinary.uploader.upload(file_path)

    const competition_image = {
      title: `${title} competition`,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    }

    const newCompetition = new Competitions({
      competition_image,
      title,
      content,
      link,
      host,
      description,
      creator_id,
    })

    await newCompetition.save()
    res.send(`"@${user.username}", you just added a new competition`)
  } catch (error) {
    res.send(error)
  }
}

// get specific competition
const specificCompetition = async (req, res) => {
  const { competition_id } = req.params
  try {
    const specificCompetition = await Competitions.findOne({
      _id: competition_id,
    })
    if (!specificCompetition) return res.status(400).send('Invalid request')

    res.send(specificCompetition)
  } catch (error) {
    res.send(error)
  }
}

// update competition
const updateCompetition = async (req, res) => {
  const { competition_id, creator_id } = req.params

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const competition = await Competitions.findOne({ _id: competition_id })
    if (!competition)
      return res.status(400).send('Cannot fetch data of invalid user')

    if (competition.creator_id !== creator_id)
      return res
        .status(400)
        .send(`"@${user.username}", you cannot update competition`)

    const { title, link, host, description, content } = req.body

    await Competitions.updateOne(
      { _id: competition_id },
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

    res.send(`"@${user.username}", you successfully updated competition`)
  } catch (error) {
    res.send(error)
  }
}

// delete specific competition
const deleteCompetition = async (req, res) => {
  const { competition_id, creator_id } = req.params

  try {
    const user = await Users.findOne({ _id: creator_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const competition = await Competitions.findOne({ _id: competition_id })
    if (!competition)
      return res.status(400).send('Cannot fetch data of invalid user')

    if (competition.creator_id !== creator_id)
      return res
        .status(400)
        .send(`"@${user.username}", you cannot delete competition`)

    if (competition.competition_image.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(
        competition.competition_image.cloudinary_id,
      )
    }

    await Competitions.deleteOne({
      _id: competition_id,
    })

    res.send(`"@${user.username}", you successfully deleted competition`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allCompetitions,
  createCompetition,
  specificCompetition,
  updateCompetition,
  deleteCompetition,
}
