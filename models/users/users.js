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
        default: '',
    },

    lastname: {
        type: String,
        default: '',
    },

    gender: {
        type: String,
        default: '',
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
        default: '',
    },
    cloudinary_id: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
}, {
    _id: false,
}, )

const posts = new Schema({
    post_id: {
        type: String,
        default: '',
    },
}, {
    _id: false,
}, )

//
const UserSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'user_id is required'],
    },
    profile_picture: profile_picture,
    bio: bio,
    posts: [posts],
    is_active: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Users', UserSchema)