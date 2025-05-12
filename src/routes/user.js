const { Connection, connect } = require('mongoose');
const {authUser} = require('../middlewares/auth')
const User = require('../models/user.model')

const express = require('express');
const ConnectionRequest = require('../models/connectionRequest.model');
const userRouter = express.Router();



// Get User pending Requests
userRouter.get("/user/requests/received" , authUser ,  async (req,res)=>{
    try {
        const userId = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId : userId._id,
            status : "interested"
        }).populate("fromUserId",["firstName" , "lastName" , "emailId" , "bio" ,"age" , "skills"])
        console.log(connectionRequests , "connectionRequests" )

        res.status(200).send({msg : "User Requests Fetched Succesfully" , data : connectionRequests})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }
})


// Get User Connections
userRouter.get("/user/connections" , authUser , async (req, res)=>{
    try {
        const userId = req.user._id
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId : userId, status : "accepted"},
                {toUserId : userId, status : "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "emailId", "bio", "age", "skills"])
        .populate("toUserId", ["firstName", "lastName", "emailId", "bio", "age", "skills"])

        const connections = connectionRequests.map((connection)=>{
            if(connection.fromUserId._id.toString() === userId.toString()){
                return connection.toUserId
            }else{
                return connection.fromUserId
            }
        })

        res.status(200).send({msg : "User Connections Fetched Succesfully", data : connections})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }
})

// Get User Feed
userRouter.get("/feed" , authUser , async (req, res)=>{
    try {
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId, "loggedInUserId feed")
        // Find all the connection sent or Received
        const connectionRequests = await ConnectionRequest.find({
            $or : [{fromUserId : loggedInUserId }, {toUserId : loggedInUserId}]
        }).select("fromUserId toUserId")
        .populate("fromUserId", "firstName")
        .populate("toUserId", "firstName")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((connection)=>{
                hideUsersFromFeed.add(connection.toUserId._id.toString())
                hideUsersFromFeed.add(connection.fromUserId._id.toString())
            
        })
        console.log(hideUsersFromFeed, "hideUsersFromFeed")
        
        const users = await User.find({
            $and : [
                { _id : {$nin : Array.from(hideUsersFromFeed)} },
                { _id : {$ne : loggedInUserId._id} }
                ]}).select("firstName lastName emailId bio age skills")

        res.status(200).send({msg : "User Feed Fetched Succesfully", data : users})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }
})

module.exports = userRouter