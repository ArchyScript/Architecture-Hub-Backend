const JWT = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.jwt_token_secret_key

const verifyUserToken = async(req, res, next) => {
    const userToken = await req.header('x-auth-token')

    // Checks if a token is found in the header
    if (!userToken) {
        return res.status(401).send('Access Denied')
    }

    // Checks if the provided token is a valid one
    try {
        // use JWT to verify the user provided token with the secret key
        const verifiedUser = await JWT.verify(userToken, SECRET_KEY)
        req.user = verifiedUser
        next()
    } catch (error) {
        return res.status(400).send('Invalid Token')
    }
}

module.exports = { verifyUserToken }