const express = require('express')
const cors = require('cors')
const connectDb  = require('./config/database')
const User = require('./models/user.model')
const cookieParser = require('cookie-parser')

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

const app = express()

app.use(cors({
    origin : "http://localhost:5173" , 
    credentials : true
}))


app.use(express.json())
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/",userRouter)


connectDb().then(()=>{
    console.log("Data base Connected succesfully")
    app.listen(3000 , () =>{
        console.log("App Started Running")
    })
}).catch((err)=>{
    console.log("Data base Connection Failed" , err)
})

