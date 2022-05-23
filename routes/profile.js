const router = require('express').Router()
const { upload } = require('../utilities/multer')
const cloudinary = require('../utilities/cloudinary')
const Profile = require('../models/profile/Profile')

// // single file upload
router.post('/', upload.single('image'), async(req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)

        // res.json(result)
        let userProfile = new Profile({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        })

        const savedProfile = await userProfile.save()
        res.json(savedProfile)
    } catch (error) {
        console.log(error)
    }
})

// get all profile
router.get('/', async(req, res) => {
    try {
        const allProfiles = await Profile.find()
        res.json(allProfiles)
    } catch (error) {
        console.log(error)
    }
})

// get single profile
router.get('/:id', async(req, res) => {
    try {
        let singleProfile = await Profile.findOne({ _id: req.params.id })

        if (!singleProfile) return res.send('No profile found in database')

        res.json(singleProfile)
    } catch (error) {
        console.log(error)
    }
})

// update  profile
router.put('/:id', upload.single('image'), async(req, res) => {
    try {
        let singleProfile = await Profile.findOne({ _id: req.params.id })

        if (!singleProfile) return res.send('No profile found in database')
            // Remove picture from cloudinary
            // await cloudinary.uploader.destroy(singleProfile.cloudinary_id)
            // Upload new picture to cloudinary
            // Some valiations needed though
        const result = await cloudinary.uploader.upload(req.file.path)
            // console.log(result)
        let data = {
            name: req.body.name || singleProfile.name,
            avatar: result.secure_url || singleProfile.avatar,
            cloudinary_id: result.public_id || singleProfile.cloudinary_id,
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
            req.params.id,
            data, { new: true },
        )

        res.json(updatedProfile)
    } catch (error) {
        console.log(error)
    }
})

// delete profile picture
router.delete('/:id', async(req, res) => {
    try {
        let profileToDelete = await Profile.findOne({ _id: req.params.id })

        if (!profileToDelete) return res.send('No profile found in database')
        await cloudinary.uploader.destroy(profileToDelete.cloudinary_id)

        await profileToDelete.remove()
        res.json(profileToDelete)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router