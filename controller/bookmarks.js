const Users = require('../models/Users')
// const Bookmarks = require('../models/Bookmarks')
const Competitions = require('../models/Competitions')
const Posts = require('../models/Posts')
const Scholarships = require('../models/Scholarships')

const validatePostType = async (post_type, post_id, res) => {
  if (post_type === 'post') {
    // check if post is valid
    const singlePost = await Posts.findById({ _id: post_id })
    if (!singlePost) return res.status(400).send('Invalid request on Post')
  }

  if (post_type === 'competition') {
    // check if competition is valid
    const specificCompetition = await Competitions.findOne({
      _id: post_id,
    })
    if (!specificCompetition)
      return res.status(400).send('Invalid request on competition')
  }

  if (post_type === 'scholarship') {
    // check if scholarship is valid
    const specificScholarship = await Scholarships.findOne({
      _id: post_id,
    })
    if (!specificScholarship)
      return res.status(400).send('Invalid request on scholarship')
  }

  return true
}

//
const singleBookmarkedPost = async (req, res) => {
  const { post_type, post_id } = req.params
  if (!post_type || !post_id)
    return res.status(400).send('Post type not selected')

  try {
    if (
      post_type === 'post' ||
      post_type === 'competition' ||
      post_type === 'scholarship'
    ) {
      if (post_type === 'post') {
        const singlePost = await Posts.findById({ _id: post_id })
        if (!singlePost) return res.status(400).send('Invalid request')

        res.send(singlePost)
      }

      if (post_type === 'competition') {
        const specificCompetition = await Competitions.findOne({
          _id: post_id,
        })
        if (!specificCompetition) return res.status(400).send('Invalid request')

        res.send(specificCompetition)
      }

      if (post_type === 'scholarship') {
        const specificScholarship = await Scholarships.findOne({
          _id: post_id,
        })
        if (!specificScholarship) return res.status(400).send('Invalid request')

        res.send(specificScholarship)
      }
    } else {
      return res
        .status(400)
        .send(`only posts, competitiions and scholarships can be bookmarked`)
    }
  } catch (error) {
    res.send(error)
  }
}

//
const addToBookmarked = async (req, res) => {
  const { user_id, post_type, post_id } = req.params
  if (!post_type || !post_id || !user_id)
    return res.status(400).send('Sorry, an error occurred')

  //
  try {
    // checks if user that wants to bookmark post is valid
    const user = await Users.findById({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    if (
      post_type === 'post' ||
      post_type === 'competition' ||
      post_type === 'scholarship'
    ) {
      if (post_type === 'post') {
        const singlePost = await Posts.findById({ _id: post_id })
        if (!singlePost) return res.status(400).send('Invalid request on Post')
      }

      if (post_type === 'competition') {
        const specificCompetition = await Competitions.findOne({
          _id: post_id,
        })
        if (!specificCompetition)
          return res.status(400).send('Invalid request on competition')
      }

      if (post_type === 'scholarship') {
        const specificScholarship = await Scholarships.findOne({
          _id: post_id,
        })
        if (!specificScholarship)
          return res.status(400).send('Invalid request on scholarship')
      }

      // create new bookmark object
      const new_post_to_add_to_user_bookmarked_posts = {
        post_id,
        post_type,
      }

      //
      let updated_user_bookmarked_posts = []

      // check if post have been bookmarked by user
      const is_post_already_bookmarked_by_user = user.bookmarked.find(
        (bookmarked_post) =>
          bookmarked_post.post_id ===
            new_post_to_add_to_user_bookmarked_posts.post_id &&
          bookmarked_post.post_type ===
            new_post_to_add_to_user_bookmarked_posts.post_type,
      )
      if (is_post_already_bookmarked_by_user)
        return res
          .status(400)
          .send(`"@${user.username}", you have already bookmarked this post`)

      //
      if (user.bookmarked.length >= 1) {
        updated_user_bookmarked_posts = [
          new_post_to_add_to_user_bookmarked_posts,
          ...user.bookmarked,
        ]
      } else {
        updated_user_bookmarked_posts = [
          new_post_to_add_to_user_bookmarked_posts,
        ]
      }

      // update user bookmarked
      await Users.updateOne(
        { _id: user_id },
        {
          $set: {
            bookmarked: updated_user_bookmarked_posts,
          },
        },
      )

      res.status(200).send(`"@${user.username}", you just bookmarked this post`)
    } else {
      return res
        .status(400)
        .send(
          `"@${user.username}", you can only bookmark either a post, competitiion or scholarship`,
        )
    }
  } catch (error) {
    res.send(error)
  }
}

// delete competition
const removeFromBookmarked = async (req, res) => {
  const { user_id, post_type, post_id } = req.params
  if (!post_type || !post_id || !user_id)
    return res.status(400).send('Sorry, an error occurred')

  //
  try {
    // checks if user that wants to bookmark post is valid
    const user = await Users.findById({ _id: user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    if (
      post_type === 'post' ||
      post_type === 'competition' ||
      post_type === 'scholarship'
    ) {
      if (post_type === 'post') {
        const singlePost = await Posts.findById({ _id: post_id })
        if (!singlePost) return res.status(400).send('Invalid request on Post')
      }

      if (post_type === 'competition') {
        const specificCompetition = await Competitions.findOne({
          _id: post_id,
        })
        if (!specificCompetition) return res.status(400).send('Invalid request')
      }

      if (post_type === 'scholarship') {
        const specificScholarship = await Scholarships.findOne({
          _id: post_id,
        })
        if (!specificScholarship) return res.status(400).send('Invalid request')
      }

      // create new bookmark object
      const new_post_to_remove_from_user_bookmarked_posts = {
        post_id,
        post_type,
      }

      // check if post have been bookmarked by user
      const is_post_already_bookmarked_by_user = user.bookmarked.find(
        (bookmarked_post) =>
          bookmarked_post.post_id ===
            new_post_to_remove_from_user_bookmarked_posts.post_id &&
          bookmarked_post.post_type ===
            new_post_to_remove_from_user_bookmarked_posts.post_type,
      )
      if (!is_post_already_bookmarked_by_user)
        return res
          .status(400)
          .send(`"@${user.username}", you did not bookmark this ${post_type}`)

      // update user bookmarked post
      // const updated_user_bookmarked_posts = user.bookmarked.filter(
      //   (bookmarked_post) => {
      //     if (
      //       bookmarked_post.post_id ===
      //         new_post_to_remove_from_user_bookmarked_posts.post_id &&
      //       bookmarked_post.post_type ===
      //         new_post_to_remove_from_user_bookmarked_posts.post_type
      //     ) {
      //       console.log('cook')
      //     } else {
      //       console.log('meat')
      //     }

      //     return (
      //       bookmarked_post !== new_post_to_remove_from_user_bookmarked_posts
      //     )
      //   },

      let updated_user_bookmarked_posts = []

      await user.bookmarked.forEach((bookmarked_post) => {
        if (
          bookmarked_post.post_id ===
            new_post_to_remove_from_user_bookmarked_posts.post_id &&
          bookmarked_post.post_type ===
            new_post_to_remove_from_user_bookmarked_posts.post_type
        ) {
        } else {
          updated_user_bookmarked_posts.unshift(bookmarked_post)
        }
      })

      // update user bookmarked
      await Users.updateOne(
        { _id: user_id },
        {
          $set: {
            bookmarked: updated_user_bookmarked_posts,
          },
        },
      )

      res
        .status(200)
        .send(
          `"@${user.username}", you just removed a post from your bookmarked list`,
        )
    } else {
      return res
        .status(400)
        .send(
          `"@${user.username}", you can only remove bookmark on a post, competitiion or scholarship`,
        )
    }
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  singleBookmarkedPost,
  addToBookmarked,
  removeFromBookmarked,
}
