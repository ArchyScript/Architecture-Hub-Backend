const JWT = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.jwt_token_secret_key

const checkUserAuth = async(req, res, next) => {
    const userToken = await req.header('x-auth-token')

    // Checks if a token is found in the header
    if (!userToken) {
        return res.status(401).json({
            errors: [{
                msg: 'No token found',
            }, ],
        })
    }

    // Checks if the provided token is a valid one
    try {
        // use JWT to verify the user provided token with the secret key
        const user = await JWT.verify(userToken, SECRET_KEY)
        req.user = user.email
        next()
    } catch (error) {
        return res.json({
            errors: [{
                msg: 'Invalid token',
            }, ],
        })
    }
}

module.exports = { checkUserAuth }