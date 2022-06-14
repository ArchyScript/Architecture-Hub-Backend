const router = require('express').Router()
const cloudinary = require('../../config/cloudinary')
const Profile = require('../../models/profile/profile')

// get all profile
const getAllUsers = async (req, res) => {
  try {
    const allProfiles = await Profile.find()
    res.json(allProfiles)
  } catch (error) {
    res.send(error)
  }
}

const createUserProfile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path)

    let userProfile = new Profile({
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    })

    const savedProfile = await userProfile.save()
    res.json(savedProfile)
  } catch (error) {
    res.send(error)
  }
}

const getSingleUser = async (req, res) => {
  try {
    let singleProfile = await Profile.findOne({ _id: req.params.id })

    if (!singleProfile) return res.send('No profile found in database')

    res.json(singleProfile)
  } catch (error) {
    res.send(error)
  }
}

const updateUser = async (req, res) => {
  try {
    let singleProfile = await Profile.findOne({ _id: req.params.id })

    if (!singleProfile) return res.send('No profile found in database')
    // Remove picture from cloudinary
    // await cloudinary.uploader.destroy(singleProfile.cloudinary_id)
    // Upload new picture to cloudinary
    // Some valiations needed though
    const result = await cloudinary.uploader.upload(req.file.path)

    let data = {
      name: req.body.name || singleProfile.name,
      avatar: result.secure_url || singleProfile.avatar,
      cloudinary_id: result.public_id || singleProfile.cloudinary_id,
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true },
    )

    res.json(updatedProfile)
  } catch (error) {
    res.send(error)
  }
}

const deleteUser = async (req, res) => {
  try {
    res.send(req.params.id)
    // let profileToDelete = await Profile.findOne({ _id: req.params.id })

    // if (!profileToDelete) return res.send('No profile found in database')
    // await cloudinary.uploader.destroy(profileToDelete.cloudinary_id)

    // await profileToDelete.remove()
    // res.json(profileToDelete)
  } catch (error) {
    res.send(error)
  }
}

// // delete profile picture
// router.delete('/:id', async(req, res) => {
// try {
//     let profileToDelete = await Profile.findOne({ _id: req.params.id })

//     if (!profileToDelete) return res.send('No profile found in database')
//     await cloudinary.uploader.destroy(profileToDelete.cloudinary_id)

//     await profileToDelete.remove()
//     res.json(profileToDelete)
// } catch (error) {
//   res.send(error)
// }
// })

module.exports = {
  getAllUsers,
  getSingleUser,
  createUserProfile,
  updateUser,
  deleteUser,
}
