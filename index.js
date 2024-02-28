const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const taskRoute = require('./routes/task')


app.use(cors())
dotenv.config();
app.use(express.json())



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("db connected succesfully")
}).catch((err)=>{
    console.log("their has been error connecting to db:", err)
})

// health api

app.get("/health",(req,res)=>{
    res.json({
        service:"job listing server",
        status:"Active",
        time: new Date()
    })
})

// routes

app.use('/',authRoute)
app.use('/task',taskRoute)

const PORT = process.env.PORT ||3000
app.listen(PORT,()=>{
    console.log(`the app is running on ${PORT}`)
})