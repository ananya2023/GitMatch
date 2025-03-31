const express = require('express')

const app = express()

app.use("/test" , (req,res) =>{
    res.send("Hello from the server")
})

app.use("/hehu" , (req,res) =>{
    res.send("Hello from the server hehe")
})

app.listen(3000 , () =>{
    console.log("App Started Running")
})