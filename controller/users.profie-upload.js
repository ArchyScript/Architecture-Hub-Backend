const Users = require('../models/Users')
const cloudinary = require('../config/cloudinary')

// update user profile picture
const uploadProfilePicture = async (req, res) => {
  const { _id } = req.params

  if (!req.file) return res.status(400).send('No picture selected')

  try {
    const user = await Users.findOne({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // add the new profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path)

    if (user.profile_picture.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(user.profile_picture.cloudinary_id)
    }

    const profile_picture = {
      title: user.username,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    }

    await Users.updateOne(
      { _id },
      {
        $set: { profile_picture },
      },
    )

    res.send(`@${user.username}, you just uploaded a your profile picture`)
  } catch (error) {
    res.send(error)
  }
}

// delete user profile picture
const deleteProfilePicture = async (req, res) => {
  const { _id } = req.params

  try {
    const user = await Users.findById({ _id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    if (user.profile_picture.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(user.profile_picture.cloudinary_id)
    }

    const profile_picture = { title: '', avatar: '', cloudinary_id: '' }

    await Users.updateOne(
      { _id },
      {
        $set: { profile_picture },
      },
    )
    res.send(`@${user.username}, you just removed a your profile picture`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
}
