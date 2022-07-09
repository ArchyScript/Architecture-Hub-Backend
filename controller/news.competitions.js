const Competitions = require('../models/Competitions')
const { competitionValidation } = require('../validation/competitions')

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
  const { value, error } = competitionValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // value === req.body
  const newCompetition = new Competitions({
    title: req.body.title,
    content: req.body.content,
    no_of_likes: req.body.no_of_likes,
    no_of_comments: req.body.no_of_comments,
    people_engages_in_competition: req.body.people_engages_in_competition,
  })

  try {
    const savedCompetition = await newCompetition.save()
    res.send(savedCompetition)
  } catch (error) {
    res.send(error)
  }
}

// get specific competition
const specificCompetition = async (req, res) => {
  const competition_id = req.params.competition_id
  try {
    const specificCompetition = await Competitions.findById(competition_id)
    res.send(specificCompetition)
  } catch (error) {
    res.send(error)
  }
}

// update specific competition
const updateCompetition = async (req, res) => {
  const competition_id = req.params.competition_id

  // const updatecompetitionValue = {
  //     title: req.body.title
  // }
  try {
    const updatedCompetition = await Competitions.updateOne(
      { _id: competition_id },
      {
        $set: {
          title: req.body.title,
        },
      },
    )

    res.send(updatedCompetition)
    // res.send(`competition with id "${competition_id}" has been updated`)
  } catch (error) {
    res.send(error)
  }
}

// delete specific competition
const deleteCompetition = async (req, res) => {
  const competition_id = req.params.competition_id
  try {
    const deletedCompetition = await Competitions.deleteOne({
      _id: competition_id,
    })
    res.send(deletedCompetition)
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
