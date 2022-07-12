const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profile_picture = new Schema(
  {
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
  },
  {
    _id: false,
  },
)

const posts = new Schema(
  {
    post_id: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
)

const bookmarked_posts = new Schema(
  {
    post_id: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
)

const followers = new Schema(
  {
    follower_id: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
)

const followings = new Schema(
  {
    following_id: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  },
)
//
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 256,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      min: 4,
      max: 256,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 1024,
    },
    profile_picture: {
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
    },
    bio: {
      firstname: {
        type: String,
        default: '',
      },

      lastname: {
        type: String,
        default: '',
      },

      display_name: {
        type: String,
        default: '',
      },

      description: {
        type: String,
        default: '',
      },

      gender: {
        type: String,
        default: '',
        // enum: ['male', 'female'],
      },
      date_of_birth: {
        type: String,
        default: '',
      },
    },
    posts: [posts],
    bookmarked_posts: [bookmarked_posts],
    followers: [followers],
    followings: [followings],
    is_active: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    lowercase_email: {
      type: String,
      required: true,
    },
    lowercase_username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Users', UserSchema)
