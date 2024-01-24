const express = require("express");

require("./config/config");

require("dotenv").config();

const app = express();

app.use(express.json());  


const userRouter = require('./routers/userRouter')

app.use('/api/v1/', userRouter)
const port = process.env.port



app.listen(port,()=>{
    console.log(`Server is running on port :${port}`);
});