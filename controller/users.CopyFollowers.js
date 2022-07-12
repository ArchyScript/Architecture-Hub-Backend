// const Users = require('../models/Users')

// // Get all followers
// const allFollowers = async (req, res) => {
//   const { user_id } = req.params

//   try {
//     // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
//     const user = await Users.findOne({ user_id })
//     if (!user) return res.status(400).send('Cannot fetch data of invalid user')

//     res.send(user.followers)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // Get all followers
// const allFollowings = async (req, res) => {
//   const { user_id } = req.params

//   try {
//     // check if user id matches with the "user_id" in the database that was gotten from the auth datbase
//     const user = await Users.findOne({ user_id })
//     if (!user) return res.status(400).send('Cannot fetch data of invalid user')

//     res.send(user.followings)
//   } catch (error) {
//     res.send(error)
//   }
// }

// // follower new user
// const follow = async (req, res) => {
//   const { user_id, follower_id } = req.params

//   // check if user and follower is the same
//   if (user_id === follower_id)
//     return res.status(400).send(`User can't follow themselve`)

//   try {
//     // check if user_id matches with the "user_id" in the database that was gotten from the auth datbase
//     const user = await Users.findOne({ user_id })
//     if (!user) return res.status(400).send('Cannot fetch data of invalid user')

//     // check if follower_id matches with the "user_id" in the database that was gotten from the auth datbase
//     const follower = await Users.findOne({ user_id: follower_id })
//     if (!follower)
//       return res.status(400).send('Cannot fetch data of invalid follower')

//     // create a new object for new follower
//     const newFollowerObject = {
//       follower_id: follower_id,
//     }

//     // create a new object for new following
//     const newFollowingObject = {
//       follower_id: user_id,
//     }

//     let user_followers = []
//     let follower_followings = []

//     // checks if user have any follower(s) array
//     if (user.followers.length >= 1) {
//       user_followers = [...user.followers, newFollowerObject]
//     } else {
//       user_followers = [newFollowerObject]
//     }

//     // check if follower has some following(s) array
//     if (follower.followings.length >= 1) {
//       follower_followings = [...follower.followings, newFollowingObject]
//     } else {
//       follower_followings = [newFollowingObject]
//     }

//     // check so a user can't follow another user twice

//     // update user followers
//     await Users.updateOne(
//       { user_id },
//       {
//         $set: {
//           followers: user_followers,
//         },
//       },
//     )

//     // update follower followings
//     await Users.updateOne(
//       { user_id: follower_id },
//       {
//         $set: {
//           followings: follower_followings,
//         },
//       },
//     )

//     res.send(
//       `user with id ${follower_id} just followed user with id ${user_id} `,
//     )
//   } catch (error) {
//     res.send(error)
//   }
// }

// // Get all followers
// const unfollow = async (req, res) => {
//   // follower_id is for the follower that wants to unfollow a user
//   const { user_id, follower_id } = req.params

//   // check if user and follower is the same
//   if (user_id === follower_id)
//     return res.status(400).send(`User can't unfollow themselve`)

//   try {
//     // check if user_id matches with the "user_id" in the database that was gotten from the auth datbase
//     const user = await Users.findOne({ user_id })
//     if (!user) return res.status(400).send('Cannot fetch data of invalid user')

//     // check if follower_id matches with the "user_id" in the database that was gotten from the auth datbase
//     const follower = await Users.findOne({ user_id: follower_id })
//     if (!follower)
//       return res.status(400).send('Cannot fetch data of invalid following')

//     // remove follower from list of users followers
//     const remainingFollowers = user.followers.filter(
//       (follower) => follower.follower_id !== follower_id,
//     )

//     const remainingFollowings = user.followings.filter(
//       (following) => following.user_id !== user_id,
//     )

//     const user_followers = [remainingFollowers]
//     const follower_followings = [remainingFollowings]

//     // update user followers
//     await Users.updateOne(
//       { user_id },
//       {
//         $set: {
//           followers: user_followers,
//         },
//       },
//     )

//     // update follower followings
//     await Users.updateOne(
//       { user_id: follower_id },
//       {
//         $set: {
//           followings: follower_followings,
//         },
//       },
//     )

//     res.send(
//       `user with id ${follower_id} just unfollowed user with id ${user_id} `,
//     )
//   } catch (error) {
//     res.send(error)
//   }
// }

// //
// module.exports = { allFollowers, allFollowings, follow, unfollow }
