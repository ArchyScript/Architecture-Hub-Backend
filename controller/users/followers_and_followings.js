const { ContextBuilder } = require('express-validator/src/context-builder')
const Users = require('../../models/users/Users.js')

// Get all followers
const allFollowers = async (req, res) => {
  const { user_id } = req.params
  try {
    // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
    const user = await Users.findOne({ user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    res.send(user.followers)
  } catch (error) {
    res.send(error)
  }
}

// Get all followers
const allFollowings = async (req, res) => {
  const { user_id } = req.params

  try {
    // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
    const user = await Users.findOne({ user_id })
    if (!user) return res.status(400).send('Cannot fetch data of invalid user')

    res.send(user.followings)
  } catch (error) {
    res.send(error)
  }
}

// follow another user
const follow = async (req, res) => {
  const { current_user_id, another_user_id } = req.params

  // check if user and follower is the same
  if (current_user_id === another_user_id)
    return res.status(400).send(`User can't follow themselve`)

  try {
    // check if current_user_id matches with any "user_id" in the Users collection
    const current_user = await Users.findOne({ user_id: current_user_id })
    if (!current_user)
      return res.status(400).send('Cannot fetch data of invalid user')

    // check if another_user_id matches with any "user_id" in the User collection
    const another_user = await Users.findOne({ user_id: another_user_id })
    if (!another_user)
      return res
        .status(400)
        .send('Cannot fetch data of user you want to follow')

    // check if another user is part of the current user followers
    const is_another_user_in_current_user_followers = current_user.followers.find(
      (current_user_follower) =>
        current_user_follower.follower_id === another_user_id,
    )

    // return if another user matches any current user follower
    if (is_another_user_in_current_user_followers)
      return res
        .status(400)
        .send(`current user cannot refollow user they have folowed`)

    // check if current user is part of the another user following
    const is_current_user_in_another_user_followings = another_user.followings.find(
      (another_user_following) =>
        another_user_following.following_id === current_user_id,
    )

    // return if current user does not match any another user follower
    if (is_current_user_in_another_user_followings)
      return res
        .status(400)
        .send(`another user cannot be followed by their follower`)

    const newFollowingForCurrentUser = {
      following_id: another_user_id,
    }

    const newFollwerForAnotherUser = {
      follower_id: current_user_id,
    }

    let updated_current_user_followings = []
    let updated_another_user_followers = []

    if (current_user.followings.length >= 1) {
      updated_current_user_followings = [
        newFollowingForCurrentUser,
        ...current_user.followings,
      ]
    } else {
      updated_current_user_followings = [newFollowingForCurrentUser]
    }

    if (another_user.followers.length >= 1) {
      updated_another_user_followers = [
        newFollwerForAnotherUser,
        ...another_user.followers,
      ]
    } else {
      updated_another_user_followers = [newFollwerForAnotherUser]
    }

    // check so a user can't follow another user twice

    // update current user followings
    await Users.updateOne(
      { user_id: current_user_id },
      {
        $set: {
          followings: updated_current_user_followings,
        },
      },
    )

    // update another user followers
    await Users.updateOne(
      { user_id: another_user_id },
      {
        $set: {
          followers: updated_another_user_followers,
        },
      },
    )

    res.send(
      `user with id ${current_user_id} just followed user with id ${another_user_id} `,
    )
  } catch (error) {
    res.send(error)
  }
}

// unfollow another user
const unfollow = async (req, res) => {
  const { current_user_id, another_user_id } = req.params

  // check if user and follower is the same
  if (current_user_id === another_user_id)
    return res.status(400).send(`User can't unfollow themselve`)

  try {
    // check if current_user_id matches with any "user_id" in the Users collection
    const current_user = await Users.findOne({ user_id: current_user_id })
    if (!current_user)
      return res.status(400).send('Cannot fetch data of invalid user')

    // check if another_user_id matches with any "user_id" in the User collection
    const another_user = await Users.findOne({ user_id: another_user_id })
    if (!another_user)
      return res
        .status(400)
        .send('Cannot fetch data of user you want to follow')

    // check if current user have any user they are following
    if (current_user.followings.length < 1)
      return res
        .status(400)
        .send(`current user does not have any user they are following`)

    // check if another user have any followings
    if (another_user.followers.length < 1)
      return res.status(400).send(`another user does not have any followers`)

    // check if another user is part of the current user followings
    const is_another_user_in_current_user_followings = current_user.followings.find(
      (current_user_following) =>
        current_user_following.following_id === another_user_id,
    )

    // return if another user does not match any current user followings
    if (!is_another_user_in_current_user_followings)
      return res
        .status(400)
        .send(`current user cannot unfollow user they have not folowed`)

    // check if current user is part of the another user followers
    const is_current_user_in_another_user_followers = another_user.followers.find(
      (another_user_follower) =>
        another_user_follower.follower_id === current_user_id,
    )

    // return if current user does not match any another user follower
    if (!is_current_user_in_another_user_followers)
      return res
        .status(400)
        .send(
          `another user cannot be unfollowed by user that have not  folowed them`,
        )

    let updated_current_user_followings = []
    let updated_another_user_followers = []

    // filter out the another user in the current user followings
    if (is_another_user_in_current_user_followings) {
      updated_current_user_followings = current_user.followings.filter(
        (current_user_followings) => {
          current_user_followings.following_id !== another_user_id
        },
      )
    }

    // filter out the current user in the another user followers
    if (is_current_user_in_another_user_followers) {
      updated_another_user_followers = another_user.followers.filter(
        (another_user_follower) => {
          another_user_follower.follower_id !== current_user_id
        },
      )
    }

    // update current user followings
    await Users.updateOne(
      { user_id: current_user_id },
      {
        $set: {
          followings: updated_current_user_followings,
        },
      },
    )

    // update another user followers
    await Users.updateOne(
      { user_id: another_user_id },
      {
        $set: {
          followers: updated_another_user_followers,
        },
      },
    )

    res.send(
      `user with id ${current_user_id} just unfollowed user with id ${another_user_id} `,
    )
  } catch (error) {
    res.send(error)
  }
}

//
module.exports = { allFollowers, allFollowings, follow, unfollow }
