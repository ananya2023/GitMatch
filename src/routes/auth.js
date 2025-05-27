const express = require('express');
const {validateSignUpData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

const authRouter = express.Router();

// Signup
authRouter.post("/signup" , async (req,res)=>{
    try {
        const {firstName, lastName ,  emailId, password} = req.body;
        //  validate user data
        validateSignUpData(req)
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        // Create an instance of User Model
        const user = new User({
            firstName , lastName , emailId , password : passwordHash
        })
        await user.save()
        res.status(200).send("User Added Succesfully") 
    } catch (error) {
        console.error("Error in Adding user", error)
        res.status(400).send("Error in Adding user" + error)
    }
    
});

// Login
authRouter.post("/login" , async (req, res)=>{
    const {emailId, password} = req.body;
    try {
        const user = await User.findOne({emailId})
        if(!user){
            return res.status(400).send("Invalid Credentials")
        }
        const isPasswordMatch = await user.validatePassword(password)
        if(!isPasswordMatch){
            return res.status(400).send("Invalid Credentials")
        }
        // create JWT Token
        const token = await user.getJWT()
        // Add the token to the cookie and send response to the users
        res.cookie("token", token , {expires : new Date(Date.now() + 3600000), httpOnly : true  })
        res.status(200).send({msg : "User Logged In Successfully" , user})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }

}); 

// Logout
authRouter.post("/logout" , async (req, res)=>{
    try {
        res.clearCookie("token")
        res.status(200).send("User Logged Out Succesfully") 
    } catch (error) {
        console.log("Error in Logging out user" , error)
    }
   
});

module.exports = authRouter;
