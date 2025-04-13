const mongoose = require('mongoose')
 

const userSchema = new mongoose.Schema({
    firstName  : {
        type : String ,
        required : true,
        minLength : 4,
        maxLength : 30
    },
    lastName : {
        type : String ,
        required : true
    },
    emailId : {
        type : String ,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String , 
        required : true
    },
    mobileNumber : {
        type : String 
    },
    age : {
        type : Number,
        min : 12,
        max : 100
    },
    gender : {
        type : String,
        validate(value) {
            if(value != "male" && value != "female" && value != "other") {
                throw new Error("Gender must be male, female or other")
            }
        }
    },
    photoUrl : {
        type : String,
    },
    bio : {
        type : String,
        default : "Hey there! I am  a techie"
    },
    skills : {
        type : [String],
        default : []
    }
    },
    {
        timestamps : true
    })

const userModel = mongoose.model("User" , userSchema ) 
module.exports = userModel