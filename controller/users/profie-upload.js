const Users = require('../../models/users/users')
const cloudinary = require('../../config/cloudinary')

// update user account
const uploadProfilePicture = async(req, res) => {
    // get user_id from the parameter passed in as a request
    const user_id = req.params.user_id

    // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
    const user = await Users.findOne({ user_id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // add the new profile pictur to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path)

    // check if user have existing profile picture and delete from the cloudinary server
    try {
        if (user.profile_picture) {
            await cloudinary.uploader.destroy(user.profile_picture.cloudinary_id)
        }
    } catch (error) {
        console.log(error)
    }

    const profile_picture = {
        name: user.bio.name || '',
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
    }

    try {
        const updatedUser = await Users.updateOne({ user_id: user_id }, {
            $set: { profile_picture: profile_picture },
        }, )

        res.send(updatedUser)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    uploadProfilePicture,
}