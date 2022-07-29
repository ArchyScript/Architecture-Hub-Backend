const Users = require('../models/Users.js')

// Get all followers
const allFollowers = async(req, res) => {
    const { _id } = req.params

    try {
        const user = await Users.findById({ _id })
        if (!user) return res.status(400).send('Cannot fetch data of invalid user')

        res.send(user.followers)
    } catch (error) {
        res.send(error)
    }
}

// Get all followings
const allFollowings = async(req, res) => {
    const { _id } = req.params

    try {
        const user = await Users.findById({ _id })
        if (!user) return res.status(400).send('Cannot fetch data of invalid user')

        res.send(user.followings)
    } catch (error) {
        res.send(error)
    }
}

// follow another user
const follow = async(req, res) => {
    const { current_user_id, user_to_follow_id } = req.params

    // check if user and follower is the same
    if (current_user_id === user_to_follow_id)
        return res.status(400).send(`User can't follow themselve`)

    try {
        // check if current_user_id matches with any "_id" in the db
        const current_user = await Users.findOne({ _id: current_user_id })
        if (!current_user)
            return res.status(400).send('Cannot fetch data of invalid user')

        // check if user_to_follow_id matches with any "user_id" in the User collection
        const user_to_follow = await Users.findOne({ _id: user_to_follow_id })
        if (!user_to_follow)
            return res
                .status(400)
                .send('Cannot fetch data of user you want to follow')

        // check if user to follow is part of the current user followings
        // Or check if current user has already follwed user to follow
        // const is_user_to_follow_in_current_user_followings = current_user.followings.find(
        //   (current_user_following) =>
        //     current_user_following.following_id === user_to_follow_id,
        // )
        // // return if another user matches any current user following
        // if (is_user_to_follow_in_current_user_followings)
        //   return res
        //     .status(400)
        //     .send(
        //       `"@${current_user.username}" is already a follower of  "@${user_to_follow.username}" `,
        //     )

        // // check if current user is part of the user to follow followers
        // const is_current_user_in_user_to_follow_followers = user_to_follow.followers.find(
        //   (user_to_follow_follower) =>
        //     user_to_follow_follower.follower_id === current_user_id,
        // )

        // // return if current user does not match any user to follow follower
        // if (is_current_user_in_user_to_follow_followers)
        //   return res
        //     .status(400)
        //     .send(
        //       `"@${current_user.username}" is already a follower of "${user_to_follow.username}"`,
        //     )

        let is_user_to_follow_in_current_user_followings = false
        let is_current_user_in_user_to_follow_followers = false

        current_user.followings.forEach((current_user_following) => {
            if (current_user_following.following_id === user_to_follow_id) {
                is_user_to_follow_in_current_user_followings = true
            }
        })

        // return if another user matches any current user following
        if (is_user_to_follow_in_current_user_followings)
            return res
                .status(400)
                .send(
                    `"@${current_user.username}" is already a follower of  "@${user_to_follow.username}" `,
                )

        //
        user_to_follow.followers.forEach((user_to_follow_follower) => {
            if (user_to_follow_follower.follower_id === current_user_id) {
                is_current_user_in_user_to_follow_followers = true
            }
        })

        // return if current user does not match any user to follow follower
        if (is_current_user_in_user_to_follow_followers)
            return res
                .status(400)
                .send(
                    `"@${current_user.username}" is already a follower of "${user_to_follow.username}"`,
                )

        //
        const current_user_new_following = { following_id: user_to_follow_id }
        const user_to_follow_new_follower = { follower_id: current_user_id }

        let updated_current_user_followings = []
        let updated_user_to_follow_followers = []

        if (current_user.followings.length >= 1) {
            updated_current_user_followings = [
                current_user_new_following,
                ...current_user.followings,
            ]
        } else {
            updated_current_user_followings = [current_user_new_following]
        }

        if (user_to_follow.followers.length >= 1) {
            updated_user_to_follow_followers = [
                user_to_follow_new_follower,
                ...user_to_follow.followers,
            ]
        } else {
            updated_user_to_follow_followers = [user_to_follow_new_follower]
        }

        // update current user followings
        await Users.updateOne({ _id: current_user_id }, {
            $set: {
                followings: updated_current_user_followings,
            },
        }, )

        // // update user to follow followers
        await Users.updateOne({ _id: user_to_follow_id }, {
            $set: {
                followers: updated_user_to_follow_followers,
            },
        }, )

        res.send(
            `"@${current_user.username}" just followed "${user_to_follow.username}" `,
        )
    } catch (error) {
        res.send(error)
    }
}

// unfollow another user
const unfollow = async(req, res) => {
    const { current_user_id, user_to_unfollow_id } = req.params

    // check if current user and user to unfollow are the same
    if (current_user_id === user_to_unfollow_id)
        return res.status(400).send(`User can't unfollow themselve`)

    try {
        // check if current user exist
        const current_user = await Users.findOne({ _id: current_user_id })
        if (!current_user)
            return res.status(400).send('Cannot fetch data of invalid user')

        // check if user to unfollow exist
        const user_to_unfollow = await Users.findOne({
            _id: user_to_unfollow_id,
        })
        if (!user_to_unfollow)
            return res
                .status(400)
                .send('Cannot fetch data of user you want to follow')

        // check if current user have any following
        if (current_user.followings.length < 1)
            return res
                .status(400)
                .send(`@${current_user.username}" have no followings`)

        // check if user to unfollow have any followers
        if (user_to_unfollow.followers.length < 1)
            return res
                .status(400)
                .send(`@${user_to_unfollow.username} have no followers`)

        let is_user_to_unfollow_in_current_user_followings = false
        let is_current_user_in_user_to_unfollow_followers = false

        const updated_current_user_followings = []
        const updated_user_to_unfollow_followers = []

        //
        current_user.followings.forEach((current_user_following) => {
            if (current_user_following.following_id === user_to_unfollow_id) {
                is_user_to_unfollow_in_current_user_followings = true
            } else {
                updated_current_user_followings.push(current_user_following)
            }
        })

        //
        user_to_unfollow.followers.forEach((user_to_unfollow_follower) => {
            if (user_to_unfollow_follower.follower_id === current_user_id) {
                is_current_user_in_user_to_unfollow_followers = true
            } else {
                updated_user_to_unfollow_followers.push(user_to_unfollow_follower)
            }
        })

        //
        if (!is_user_to_unfollow_in_current_user_followings)
            return res
                .status(400)
                .send(
                    `"@${current_user.username}" cannot unfollow "@${user_to_unfollow.username}"`,
                )

        // return if current user does not match any another user follower
        if (!is_current_user_in_user_to_unfollow_followers)
            return res
                .status(400)
                .send(
                    `"@${current_user.username}" cannot unfollow "@${user_to_unfollow.username}`,
                )

        // update current user followings
        await Users.updateOne({ _id: current_user_id }, {
            $set: {
                followings: updated_current_user_followings,
            },
        }, )

        // update another user followers
        await Users.updateOne({ _id: user_to_unfollow_id }, {
            $set: {
                followers: updated_user_to_unfollow_followers,
            },
        }, )

        res.send(
            `${current_user.username} just unfollowed ${user_to_unfollow.username}`,
        )
    } catch (error) {
        res.send(error)
    }
}

//
module.exports = { allFollowers, allFollowings, follow, unfollow }