const mongoose = require('mongoose')
 

const userSchema = new mongoose.Schema({
    firstName  : String,
    lastName : String,
    emailId : String,
    password : String,
    mobileNumber : String,
    age : Number,
    gender : String
})

const userModel = mongoose.model("User" , userSchema ) 
module.exports = userModel