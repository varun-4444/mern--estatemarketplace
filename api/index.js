import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from 'cookie-parser'
import cors from 'cors';

dotenv.config();


const app=express();

app.listen(3000,()=>
{
    console.log("service is running on port 3000!");
}) 

mongoose.connect(process.env.MONGO).then(()=> 
{
    console.log("connected to database");
}).catch((err) =>
{
    console.log("error in connecting to database");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);

app.use((err,req,res,next) =>
{
    const statusCode=err.statusCode || 500;
    const message = err.message || 'internal server error';
    return res.status(statusCode).json(
        {
            success:false,
            statusCode,             //from es6 if parameter and key has same name we can remove it
            message,
        }
    );
}
);
