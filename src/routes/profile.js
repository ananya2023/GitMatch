const express = require('express')
const bcrypt = require('bcrypt')
const {authUser} = require('../middlewares/auth')
const {validateEditProfileData} = require('../utils/validation')
const User = require('../models/user.model')


const profileRouter = express.Router()

// Get User Profile
profileRouter.get("/profile/view", authUser , async(req,res)=>{
    try {
     const user = req.user
     res.send(user)
    } catch (error) {
     res.send("Error in getting user" + error)
     
    }
 })

// update user Profile
profileRouter.patch("/profile/edit" , authUser, async (req,res)=>{
    try {
        const isEditAllowed = validateEditProfileData(req)
        if(!isEditAllowed){
            return res.status(400).send("Invalid Edit Request")
        }
           
        const user = req.user;
        const data = req.body;
        console.log(data)

        Object.keys(req.body).forEach((key)=>(user[key] = req.body[key]))
        await user.save()
        res.status(200).send({msg : `${user.firstName}, Your Profile is Updated Succesfully` , data:user})
    } catch (error) {
        console.log(error)
        res.status(400).json("UPDATE Error"+ error.message)
    }
    
});


// update user Profile
profileRouter.patch("/profile/password" , authUser, async (req,res)=>{
    try {
        const user = req.user;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        console.log(old_password)
        console.log(new_password)
        
        const isPasswordMatched = await bcrypt.compare(old_password, user.password)
        console.log(isPasswordMatched , "isPasswordMatched")
        if(!isPasswordMatched){
            return res.status(400).send("Old Password is not matched")
        }
        if(new_password){
            user.password =  await bcrypt.hash(new_password, 10)
        }

        await user.save()
        res.status(200).send({msg : `${user.firstName}, Your password is Updated Succesfully` , data:user})
    } catch (error) {
        console.log(error)
        res.status(400).json("UPDATE Error"+ error.message)
    }
});

//  // Get all users by email
//  profileRouter.get("/email" , async (req,res)=>{
//      const userObj = req.body.emailId;
//      try {
//          const data = await User.find({emailId : userObj})
//          if(data.length === 0){
//              res.status(400).send("User Not Found")
//          }
//          else {
//              res.status(200).send({msg : "User Fetched Succesfully" , data : data}) 
//          }
//      } catch (error) {
//          res.status(400).send("User not found" + error)
//      }
     
//  });
 
 // delete user
 profileRouter.delete("/user" , async (req,res)=>{
     const userObj = req.body.userId;
     try {
         const data = await User.findByIdAndDelete(userObj)
         res.status(200).send({msg : "User Deleted Succesfully"})
     } catch (error) {
         res.status(400).send("User not found" + error)
     }
     
 });
 
 


 module.exports  = profileRouter