const express = require('express')
const connectDb  = require('./config/database')
const User = require('./models/user.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('./utils/validation')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {authUser} = require('./middlewares/auth')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.post("/signup" , async (req,res)=>{
    
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

app.post("/login" , async (req, res)=>{
    const {emailId, password} = req.body;
    try {
        const user = await User.findOne({emailId})
        if(!user){
            return res.status(400).send("Invalide Credentials")
        }
        const isPasswordMatch = await user.validatePassword(password)
        console.log(isPasswordMatch , "is pw match")
        if(!isPasswordMatch){
            return res.status(400).send("Invalid Credentials")
        }
        // create JWT Token
        const token = await user.getJWT()
        // Add the token to the cookie and send response to the users
        res.cookie("token", token , {expires : new Date(Date.now() + 3600000), httpOnly : true  })
        res.status(200).send({msg : "User Logged In Succesfully"})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }

}); 

app.get("/profile", authUser , async(req,res)=>{
   try {
    const user = req.user
    res.send(user)
   } catch (error) {
    res.send("Error in getting user" + error)
    
   }
})

app.post("/sendConnectionRequest", authUser , async(req,res)=>{
    try {
     const user = req.user
     res.send(user.firstName +" is sending connection rqeuest")
    } catch (error) {
     res.send("Error in getting user" + error)
     
    }
 })
   

// Get all users by email
app.get("/email" , async (req,res)=>{
    const userObj = req.body.emailId;
    try {
        const data = await User.find({emailId : userObj})
        if(data.length === 0){
            res.status(400).send("User Not Found")
        }
        else {
            res.status(200).send({msg : "User Fetched Succesfully" , data : data}) 
        }
    } catch (error) {
        res.status(400).send("User not found" + error)
    }
    
});

// delete user
app.delete("/user" , async (req,res)=>{
    const userObj = req.body.userId;
    try {
        const data = await User.findByIdAndDelete(userObj)
        res.status(200).send({msg : "User Deleted Succesfully"})
    } catch (error) {
        res.status(400).send("User not found" + error)
    }
    
});


// update user
app.patch("/user/:userId" , async (req,res)=>{

    const userId = req.params?.userId;
    const data = req.body;
   
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "bio",
            "gender",
            "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed")
            // return res.status(400).send("Update not Allowed")
        }

        if(data.skills.length > 0){
            throw new Error("Skills can't be greated than 10")
        }
        const result = await User.findByIdAndUpdate(userId , data , {runValidators  :true}) 
        res.status(200).send({msg : "User Updated Succesfully"})
    } catch (error) {
        console.log(error)
        res.status(400).json("UPDATE Error"+ error.message)
    }
    
});


// Get all users from database
app.get("/feed" , async (req,res)=>{
    try {
        const data = await User.find({})
        res.status(200).send({msg : "User Fetched Succesfully" , data : data}) 
    } catch (error) {
        res.status(400).send("Error in fetching users",error)
    }
});

connectDb().then(()=>{
    console.log("Data base Connected succesfully")
    app.listen(3000 , () =>{
        console.log("App Started Running")
    })
}).catch((err)=>{
    console.log("Data base Connection Failed" , err)
})

