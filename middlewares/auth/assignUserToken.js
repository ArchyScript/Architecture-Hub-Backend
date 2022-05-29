require('dotenv').config()
const JWT = require('jsonwebtoken')
const SECRET_KEY = process.env.jwt_token_secret_key

//
// const assignUserToken = async(user_id, response, username) => {
const assignUserToken = async(user_id, response, logout) => {
    if (!logout || logout == null || logout == undefined) {
        const token = await JWT.sign({
                user_id,
            },
            SECRET_KEY, {
                expiresIn: 3900000,
            },
        )

        // const token = await JWT.sign({
        //         user_id,
        //         username
        //     },
        //     SECRET_KEY, {
        //         expiresIn: 3900000,
        //     },
        // )

        const userData = {
            savedUserId: user_id,
            token: token,
        }

        // // Send token to the user
        // response.header('x-auth-token', token).send(userData)
        return response.header('x-auth-token', token).send(userData)
    }

    if (logout) {
        response.removeHeader('x-auth-token')
        return response.send('Successfully logged out')
    }
}

module.exports = { assignUserToken }