import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';


export const test = (req,res)=>
{
    res.json(
        {
            message: 'An Api Route Is working',
        }
    );
};
export const updateUser= async(req,res,next)=>
{
    if(req.user.id !== req.params.id)
    return next(errorHandler(401,"you Can only update your own account"))
    try {
        if(req.body.password)
        {
            req.body.password=bcryptjs.hashSync(req.body.password,10)        
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:
            {   // set method because sometimes all form parameters are not filled for example i want update only user name and we shall not use rest operator because of admin operations
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true}
        )
        const {password,...rest}=updatedUser._doc
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async(req,res,next)=>
{
    if(req.user.id !== req.params.id)
    return next(errorHandler(401,"you Can only delete your own account"))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('user has been deleted');
    } catch (error) {
        next(error);
        
    }
}


