const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
 

const userSchema = new mongoose.Schema({
    firstName  : {
        type : String ,
        required : true,
        minLength : 4,
        maxLength : 30,
        index : true
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
        required : true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough")
            }
        }
    },
    mobileNumber : {
        type : String ,
        unique : true
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
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Photo Url should be Valid")
            }
        }
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({userId : this._id}, "GitMatch@Ananya", {expiresIn : "1d"});
    return token;
};

userSchema.methods.validatePassword = async function (enteredPassword) {
    const user = this;
    const  passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(enteredPassword, passwordHash)
    return isPasswordValid;
};
const userModel = mongoose.model("User" , userSchema ) 
module.exports = userModel