const express = require('express');
const connection = require('./config/db');
const dotenv = require('dotenv') 
dotenv.config()
const app = express();
const PORT = process.env.PORT
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('hello wisdom')
})


app.listen(PORT ,async()=>{
    try {
        await connection
        console.log(`server is running on port ${PORT} and DB is connected`)
    } catch (error) {
        console.log(error)
    }
})