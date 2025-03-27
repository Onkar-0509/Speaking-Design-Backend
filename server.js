import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'

import userRoutes from "./routes/UserRoutes.js"



const app=express()
const port=process.env.PORT || 5000



connectDB()


//middleware


app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//api endpoint


app.use('/api',userRoutes)



app.get('/',(req,res)=>{
    res.send('API WORKING Great')
})


app.listen(port,()=>console.log('server running on port',port))


