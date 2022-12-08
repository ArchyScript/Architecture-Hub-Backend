const Posts = require('../models/Posts')
const {
  postWithoutImageValidation,
  postWithImageValidation,
} = require('../validation/posts')
const Users = require('../models/Users')
const { PostComments, PostLikes } = require('../models/Reactions.Posts')
const cloudinary = require('../config/cloudinary')

// Get all posts
const allPosts = async (req, res) => {
  try {
    const posts = await (await Posts.find()).reverse()
    res.send(posts)
  } catch (error) {
    res.send(error)
  }
}

// Create new post without
const newPostWithoutImage = async (req, res) => {
  const { poster_id } = req.params

  const { value, error } = postWithoutImageValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = await Users.findOne({ _id: poster_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const post_image = { title: '', avatar: '', cloudinary_id: '' }
    const { content } = value

    const newPost = new Posts({
      content,
      post_image,
      poster_id,
    })

    const savedPost = await newPost.save()

    // new object that will be added to the collection of posts created by the user
    const newPostObject = {
      post_id: savedPost._id,
    }

    //  update creator post array
    await Users.updateOne(
      { _id: poster_id },
      {
        $set: {
          posts: [...user.posts, newPostObject],
        },
      },
    )

    res.send(`new post created`)
    // res.send(`"@${user.username}", you just added new post`)
  } catch (error) {
    res.send(error)
  }
}

// Create new post witth just one image
const newPostWithImage = async (req, res) => {
  const { poster_id } = req.params
  // post with image {file_path} = req.file for validation and
  // it's a string

  if (!req.file) return res.status(400).send('No image selected')

  const request_body = {
    content: req.body.content,
    file_path: req.file.path,
  }

  const { value, error } = postWithImageValidation(request_body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = await Users.findOne({ _id: poster_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const result = await cloudinary.uploader.upload(req.file.path)

    const { content } = value
    const post_image = {
      title: `${user.username} post`,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    }

    const newPost = new Posts({
      content,
      post_image,
      poster_id,
    })

    const savedPost = await newPost.save()

    // new object that will be added to the collection of posts created by the user
    const newPostObject = {
      post_id: savedPost._id,
    }

    //  update creator post array
    await Users.updateOne(
      { _id: poster_id },
      {
        $set: {
          posts: [...user.posts, newPostObject],
        },
      },
    )

    res.send(`new post created`)

    // res.send(`"@${user.username}", you just added new post`)
  } catch (error) {
    res.send(error)
  }
}

// get specific post
const singlePost = async (req, res) => {
  const { post_id } = req.params

  try {
    const singlePost = await Posts.findById({ _id: post_id })
    if (!singlePost) return res.status(400).send('Invalid request')

    res.send(singlePost)
  } catch (error) {
    res.send(error)
  }
}

// update specific post
const updatePost = async (req, res) => {
  const { poster_id, post_id } = req.params

  // validate the post request first
  const { value, error } = postWithoutImageValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    // check if user id matches with the "poster_id" in the database
    const user = await Users.findOne({ poster_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    // Checks if user have any post in their name
    if (user.posts.length < 1)
      return res
        .status(400)
        .send('User have no post to update, create first post')

    // find matching post by user
    const post = user.posts.find((post) => post.post_id == post_id)

    // Checks if user created this post
    if (!post) return res.status(400).send('User did not create this post')

    // Find the post  in the Posts collection by the id gotten from the user
    const postToBeUpdated = await Posts.findOne({ _id: post.post_id })
    if (!postToBeUpdated)
      return res.status(400).send('Cannot fetch post at the moment')

    const updatedPost = await Posts.updateOne(
      { _id: post.post_id },
      {
        $set: {
          title: value.title,
          content: value.content,
          edited: true,
        },
      },
    )

    res.send(updatedPost)
  } catch (error) {
    res.send(error)
  }
}

// delete post
const deletePost = async (req, res) => {
  const { poster_id, post_id } = req.params

  try {
    const user = await Users.findOne({ _id: poster_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    const post = await Posts.findOne({ _id: post_id })
    if (!post) return res.status(400).send('Cannot fetch data of invalid post')

    // Checks if user have any post
    if (user.posts.length < 1)
      return res
        .status(400)
        .send(`Hi "@${user.username}",  you have no post to delete'`)

    let did_user_create_this_post = false
    const otherPosts = []

    // Checks if user created this post
    user.posts.forEach((post) => {
      if (post.post_id === post_id) {
        did_user_create_this_post = true
      } else {
        if (post.post_id !== '') {
          otherPosts.push(post)
        }
      }
    })

    if (!did_user_create_this_post)
      return res
        .status(400)
        .send(`Hi "@${user.username}", you did not create this post`)

    // delete image from cloudinary server
    if (post.post_image.cloudinary_id !== '') {
      await cloudinary.uploader.destroy(post.post_image.cloudinary_id)
    }

    // delete comments related to post
    if (post.comments && post.comments.length >= 1) {
      post.comments.forEach(async (each_post_comment) => {
        const { comment_id } = each_post_comment
        await PostComments.deleteOne({ _id: comment_id })
      })
    }
    // delete likes related to post
    if (post.likes && post.likes.length >= 1) {
      post.likes.forEach(async (each_post_like) => {
        const { like_id } = each_post_like
        await PostLikes.deleteOne({ _id: like_id })
      })
    }

    // Delete post from Posts collection
    await Posts.deleteOne({ _id: post_id })

    // update user posts array
    await Users.updateOne(
      { _id: poster_id },
      {
        $set: {
          posts: otherPosts,
        },
      },
    )

    res.send(`Hi "@${user.username}", you just deleted a post`)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  allPosts,
  newPostWithoutImage,
  newPostWithImage,
  singlePost,
  updatePost,
  deletePost,
}
