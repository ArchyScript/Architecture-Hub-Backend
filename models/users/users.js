const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* 
name {
    firstname, lastname
}
gender
interest, age(date of birth), hobbies, 
if not archy, what?
personalities

// email, password, username are referenced
 */

const bio = new Schema({
    firstname: {
        type: String,
        required: [true, 'firstname is required'],
    },

    lastname: {
        type: String,
    },

    gender: {
        type: String,
    },
    date_of_birth: {
        type: Date,
        default: Date.now(),
    },
}, {
    _id: false,
}, )

const profile_picture = new Schema({
    title: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
    avatar: {
        type: String,
    },
}, {
    _id: false,
}, )

const UserSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'user_id is required'],
    },
    // profile_picture: {
    //     // type: Schema.Types.ObjectId,
    //     // ref: 'profile_picture',
    //     // default: null,
    // },
    // profile_picture: { type: { profile_picture }, default: null },
    profile_picture: profile_picture,
    bio: bio,
    is_active: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Users', UserSchema)