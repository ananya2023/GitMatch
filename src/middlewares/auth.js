const jwt = require("jsonwebtoken")
const User = require('../models/user.model')


const authUser = async(req,res,next) => {
    try {
    // Read the token from request
    const {token} = req.cookies
    if(!token) {
        return res.status(401).send("Please Login!") 
    }
    // validate the token
    const decodedToken =  await jwt.verify(token, "GitMatch@Ananya")
    const {userId} = decodedToken
    // Find the user
    const user  = await User.findById(userId)
    if(!user) {
        throw new Error("User not found")
    }
    req.user = user
    next()
    } catch (error) {
        res.status(400).send("Error"  + error)
    }
}

module.exports = { authUser }