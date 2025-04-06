const mongoose  = require('mongoose')
/*
Db Connection
*/
const connectDb = async (params) => {
   await  mongoose.connect('mongodb+srv://ananyamiriyala474:9UmfX08h2UqJbFNg@cluster0.w2x6hzb.mongodb.net/GitMatch')
}


module.exports = connectDb