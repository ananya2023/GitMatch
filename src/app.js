const express = require('express')
const connectDb  = require('./config/database')
const User = require('./models/user.model')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

app.post("/signup" , async (req,res)=>{
    const userObj = req.body;
    console.log(userObj , "user obj")
    // Creating new instance of a User model
    const user = new User(userObj)
    try {
        await user.save()
        res.status(200).send("User Added Succesfully") 
    } catch (error) {
        console.error("Error in Adding user", error)
        res.status(400).send("Error in Adding user" + error)
    }
   
    
});

// Get all users by email
app.get("/email" , async (req,res)=>{
    const userObj = req.body.emailId;
    console.log(userObj)
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
    console.log(userObj)
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
    console.log(userId , "user id")
    console.log(mongoose.Types.ObjectId.isValid(userId)) // should return true

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
        console.log(isUpdateAllowed)
        console.log(data)
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
        console.log(data)
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

