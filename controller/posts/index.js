const { private, public } = require('../../db/db')

const allPosts = (req, res) => {
    res.send('Welcome to post route')
}

const publicPosts = (req, res) => {
    res.json(public)
}

const privatePosts = (req, res) => {
    res.json(private)
}

module.exports = { allPosts, publicPosts, privatePosts }