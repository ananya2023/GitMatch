const express = require('express');

const requestRouter = express.Router();
const {authUser} = require('../middlewares/auth')
const User = require('../models/user.model')
const ConnectionRequest = require('../models/connectionRequest.model')



requestRouter.post("/request/send/:status/:toUserId", authUser , async(req,res)=>{
    try {
     const fromUserId = req.user._id;
     const toUserId = req.params.toUserId
     const status = req.params.status   
     console.log(fromUserId, toUserId, status)

     const allowedStatus = ["ignored" , "interested"]
     if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Invalid status Type"})
     }

     const toUserExists = await User.findById(toUserId)
     if(!toUserExists){
        return res.status(404).json({message : "User not found"})
     }
    //  If there's an existing Connection request

    const existingRequest = await ConnectionRequest.findOne({
        $or : [
            {fromUserId, toUserId},
            {fromUserId : toUserId , toUserId : fromUserId}
        ]
        })

    if(existingRequest){
        return res.status(400).json({message : "Connection request already exists"})
    }
     console.log(existingRequest, "existingRequest" )
     const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status})
     await connectionRequest.save()
     res.json({msg : req.user.firstName  + " is " + status + " in " + toUserExists.firstName})
  
    } catch (error) {
     res.send("Error" + error)
     
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