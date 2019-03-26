const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, "secret") // user Id from token
        // find user by id, and return only if specific token exist in that user(user has property tokens.token)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error("user not found")
        }
        req.token = token
        req.user = user // now rout have access to veryfied user from this code

    } catch (e) {
        res.status(401).send("Error: please authenticate")
    }
    next()
}



module.exports = auth