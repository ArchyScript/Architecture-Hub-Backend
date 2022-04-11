const JWT = require('jsonwebtoken')
const secretKey = 'ArchyScript@10'

const checkUserAuth = async(req, res, next) => {
    const userToken = await req.header('x-auth-token')

    // Checks if a token is found
    if (!userToken) {
        return res.json({
            errors: [{
                msg: 'No token found',
            }, ],
        })
    }

    // Checks if the provided token is a valid one
    try {
        // use JWT to verify the user provided token with the secret key
        const user = await JWT.verify(userToken, secretKey)
            // res.json(user)
            // console.log(user)
        req.user = user.email
        next()
    } catch (error) {
        return res.json({
            errors: [{
                msg: 'Invalid token',
            }, ],
        })
    }

    // if (userIsValid) {
    //     next()
    // } else {
    //     return res.json({
    //         errors: [{
    //             msg: 'Access denied',
    //         }, ],
    //     })
    // }
}

module.exports = checkUserAuth