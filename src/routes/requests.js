const express = require('express');

const requestRouter = express.Router();
const {authUser} = require('../middlewares/auth')
const User = require('../models/user.model')




requestRouter.post("/sendConnectionRequest", authUser , async(req,res)=>{
    try {
     const user = req.user
     res.send(user.firstName +" is sending connection rqeuest")
    } catch (error) {
     res.send("Error in getting user" + error)
     
    }
 })

// Get all users from database
requestRouter.get("/feed" , async (req,res)=>{
    try {
        const data = await User.find({})
        res.status(200).send({msg : "User Fetched Succesfully" , data : data}) 
    } catch (error) {
        res.status(400).send("Error in fetching users",error)
    }
});
   
module.exports = requestRouter