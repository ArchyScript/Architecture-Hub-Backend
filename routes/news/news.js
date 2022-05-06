const router = require('express').Router()
const {
    allCompetitions,
    specificCompetition,
    createCompetition,
    updateCompetition,
    deleteCompetition,
} = require('../../controller/news/competitions')
const {
    allScholarships,
    specificScholarship,
    createScholarship,
    updateScholarships,
    deleteScholarships,
} = require('../../controller/news/scholarships')

// competitions
router.get('/competitions', allCompetitions)
router.get('/competitions/:competition_id', specificCompetition)
router.post('/competitions/', createCompetition)
router.patch('/competitions/:competition_id', updateCompetition)
router.delete('/competitions/:competition_id', deleteCompetition)

// latest news
// router.get('/latest-news/', allCompetitions)
// router.get('/latest-news/:post_id', specificCompetition)
// router.post('/latest-news/', createCompetition)
// router.patch('/latest-news/:post_id', updateCompetition)
// router.delete('/latest-news/:post_id', deleteCompetition)

// sholarships
router.get('/scholarships/', allScholarships)
router.get('/scholarships/:scholarship_id', specificScholarship)
router.post('/scholarships/', createScholarship)
router.patch('/scholarships/:scholarship_id', updateScholarships)
router.delete('/scholarships/:scholarship_id', deleteScholarships)

module.exports = router