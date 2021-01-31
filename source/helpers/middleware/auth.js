const jwt = require('jsonwebtoken')

module.exports = {
    authentication: (req, res, next) => {
        const headers = req.headers
        if(!headers.token) {
            res.json({
                message: 'token required, please to fill it!'
            })
        } else {
            jwt.verify(headers.token, process.env.JWT_SECRET, (err, decode) => {
                if(err) {
                    res.json({
                        message: 'token not valid!'
                    })
                } else {
                    res.userAccess = decode.access
                    next()
                }
            })
        }
    },

    authorizationAdmin: (req, res, next) => {
        const access = res.userAccess
        if(access === 0) {
            next()
        } else {
            res.json({
                message: 'access denied, error authorization'
            })
        }
    },

    authorizationCashier: (req, res, next) => {
        const access = res.userAccess
        if(access === 1){
            next()
        } else {
            res.json({
                message: 'access denied, error authorization'
            })
        }
    }
}