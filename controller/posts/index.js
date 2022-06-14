const Posts = require('../../models/posts/posts')
const { postValidation } = require('../../validation/posts')
const Users = require('../../models/users/users')

// Get all posts
const allPosts = async (req, res) => {
  try {
    const posts = await Posts.find()
    res.send(posts)
  } catch (error) {
    res.send(error)
  }
}

// Create new post
const createPost = async (req, res) => {
  // get user_id from the parameter passed in as a request
  const user_id = req.params.user_id

  // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
  const user = await Users.findOne({ user_id: user_id })
  if (!user) return res.status(400).send('Cannot fetch data of invalid user')

  const { value, error } = postValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const newPost = new Posts({
    title: value.title,
    content: value.content,
    user_id: user_id,
  })

  try {
    const savedPost = await newPost.save()

    // new object that will be added to the collection of posts created by the user
    const newPostObjectId = {
      post_id: savedPost._id,
    }

    // reference new post by its id in the user posts array
    const updateUserPostsArray = await Users.updateOne(
      { user_id },
      {
        $set: {
          // use the sprea operator to
          posts: [...user.posts, newPostObjectId],
        },
      },
    )

    res.send(updateUserPostsArray)
  } catch (error) {
    res.send(error)
  }
}

// get specific post
const singlePost = async (req, res) => {
  const post_id = req.params.post_id

  try {
    const singlePost = await Posts.findById({ _id: post_id })
    if (!singlePost)
      return res
        .status(400)
        .send('No post has been created yet, create your first post')

    console.log(singlePost)
    res.send(singlePost)
  } catch (error) {
    res.send(error)
  }
}

// update specific post
const updatePost = async (req, res) => {
  const { user_id, post_id } = req.params

  // validate the post request first
  const { value, error } = postValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // check if user id matches with the "user_id" in the database
  const user = await Users.findOne({ user_id })
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

  try {
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
  const { user_id, post_id } = req.params

  // check if user id matches with the "user_id" in the database
  const user = await Users.findOne({ user_id })
  if (!user) return res.status(400).send('Cannot fetch data of invalid user')
  // Checks if user have any post in their name
  if (user.posts.length < 1)
    return res.status(400).send('User have no post to delete')

  // Checks if user created this post
  const filteredPost = user.posts.find((post) => post.post_id == post_id)
  if (!filteredPost)
    return res.status(400).send('User did not create this post')

  // filter out the deleted post and kep the remaing post(s) available
  const otherPosts = user.posts.filter((post) => post !== filteredPost)

  // Find the post  in the Posts collection by the id gotten from the user
  // const postToBeDeleted = await Posts.findOne({ _id: filteredPost.post_id })
  // if (!postToBeDeleted)
  //     return res
  //         .status(400)
  //         .send('Cannot fetch post from collection at the moment')

  try {
    // Delete post from Posts collection
    await Posts.deleteOne({ _id: post_id })

    // update user posts array
    await Users.updateOne(
      { user_id },
      {
        $set: {
          posts: otherPosts,
        },
      },
    )

    res.send('Posts successfully deleted')
  } catch (error) {
    res.send(error)
  }
}

module.exports = { allPosts, createPost, singlePost, updatePost, deletePost }
