const Scholarships = require('../../models/news/Scholarships')
const { scholarshipValidation } = require('../../validation/news/scholarship')

// Get all scholarships
const allScholarships = async(req, res) => {
    try {
        const scholarships = await Scholarships.find()
        res.send(scholarships)
    } catch (error) {
        res.send(error)
    }
}

// Create new scholarship
const createScholarship = async(req, res) => {
    const { value, error } = scholarshipValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // value === req.body
    const newScholarships = new Scholarships({
        title: req.body.title,
        content: req.body.content,
        no_of_likes: req.body.no_of_likes,
        no_of_comments: req.body.no_of_comments,
    })

    try {
        const savedScholarships = await newScholarships.save()
        res.send(savedScholarships)
    } catch (error) {
        res.send(error)
    }
}

// get specific scholarship
const specificScholarship = async(req, res) => {
    const scholarship_id = req.params.scholarship_id
    try {
        const specificScholarship = await Scholarships.findById(scholarship_id)
        res.send(specificScholarship)
    } catch (error) {
        res.send(error)
    }
}

// update specific scholarship
const updateScholarships = async(req, res) => {
    const scholarship_id = req.params.scholarship_id

    // const updateccholarshipsValue = {
    //     title: req.body.title
    // }
    try {
        const updatedScholarships = await Scholarships.updateOne({ _id: scholarship_id }, {
            $set: {
                title: req.body.title,
            },
        }, )

        res.send(updatedScholarships)
            // res.send(`scholarship with id "${scholarship_id}" has been updated`)
    } catch (error) {
        res.send(error)
    }
}

// delete specific scholarship
const deleteScholarships = async(req, res) => {
    const scholarship_id = req.params.scholarship_id
    try {
        const deletedScholarships = await Scholarships.deleteOne({
            _id: scholarship_id,
        })
        res.send(deletedScholarships)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    allScholarships,
    createScholarship,
    specificScholarship,
    updateScholarships,
    deleteScholarships,
}