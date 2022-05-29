const error = (res, msg) => {
    res.status(401).json({
        errors: [{
            msg,
        }, ],
    })
}

module.exports = { error }