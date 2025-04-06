const express = require('express')
const connectDb  = require('./config/database')
const User = require('./models/user.model')

const app = express()
app.use(express.json())

app.post("/signup" , async (req,res)=>{
    const userObj = req.body;
    console.log(userObj)
    // Creating new instance of a User model
    const user = new User(userObj)
    try {
        await user.save()
        res.status(200).send("User Added Succesfully") 
    } catch (error) {
        res.status(400).send("UseError in Adding user",error)
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

