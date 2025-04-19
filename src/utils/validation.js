const validator = require('validator')

const validateSignUpData = (req) =>{
    const {firstName, lastName ,  emailId, password, confirmPassword} = req.body;

    if(!firstName || !lastName){
        throw new Error('First and last names are required');
    }
    else if(firstName.length < 4 || firstName.length > 50){
        throw new Error('First name must be between 4 and 50 characters');
        
    }
    else if(!emailId){
        throw new Error('Email must not be empty')
    }

    else if(!validator.isEmail(emailId)){
       throw new Error('Email must be a valid email address');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol');
    }    
}


module.exports = {
    validateSignUpData
}       