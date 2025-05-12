const express = require('express');

const requestRouter = express.Router();
const {authUser} = require('../middlewares/auth')
const User = require('../models/user.model')
const ConnectionRequest = require('../models/connectionRequest.model')


// Send Connection Request
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

//  Reject or Accept Connection Request
/* 
  loggedInuser = touserId
  status = intrested
  requestIdValid
*/

requestRouter.post("/request/review/:status/:requestId", authUser , async(req,res)=>{
    try {
     const loggedInUser = req.user;
     console.log(loggedInUser , "logged in usr ")
      
     const  {status,requestId} = req.params   
    //  console.log(fromUserId, toUserId, status)

     const allowedStatus = ["accepted" , "rejected"]
     if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Status is not allowed"})
     }
      
     const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId : loggedInUser._id,
        status : "interested"  
     })
     if(!connectionRequest){
        return res.status(404).json({message : "Connection Request not found"})
     }
     connectionRequest.status = status
     const data = await connectionRequest.save()
     res.json({msg : "Coonection Request " + status ,data})
  
    } catch (error) {
     res.send("Error" + error)
     
    }
 }) 

module.exports = requestRouter