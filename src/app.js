const express = require('express')
const connectDb  = require('./config/database')
const User = require('./models/user.model')
const cookieParser = require('cookie-parser')

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDb().then(()=>{
    console.log("Data base Connected succesfully")
    app.listen(3000 , () =>{
        console.log("App Started Running")
    })
}).catch((err)=>{
    console.log("Data base Connection Failed" , err)
})

