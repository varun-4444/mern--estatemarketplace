import mongoose from 'mongoose'

const userSchema=new mongoose.Schema(
    {
        username:
        {
            type:"string",
            required:true,
            unique:true,   
        },

        email:
        {
            type:"string",
            required:true,
            unique:true,   
        },

        password:
        {
            type:"string",
            required:true,
        },

        avatar:
        {
            type:"string",
            default:"https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
        },

    }, { timestamps:true} 
);

const User = mongoose.model('User',userSchema);

export default User;