require('dotenv').config()
const JWT = require('jsonwebtoken')
const SECRET_KEY = process.env.jwt_token_secret_key

//
const assignUserToken = async(user_id, response) => {
    const token = await JWT.sign({
            user_id,
        },
        SECRET_KEY, {
            expiresIn: 3900000,
        },
    )

    const userData = {
        savedUserId: user_id,
        token: token,
    }

    // // Send token to the user
    // response.header('x-auth-token', token).send(userData)
    response.header('x-auth-token', token)
}

module.exports = { assignUserToken }