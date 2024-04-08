import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=> 
{
    console.log("connected to database");
}).catch((err) =>
{
    console.log("error in connecting to database");
});


const app=express();

app.listen(3000,()=>
{
    console.log("service is running on port 3000!");
})   

app.use(express.json());
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
