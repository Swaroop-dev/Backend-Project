const BigPromise=require('./../middlewares/BigPromise')
const User=require('./../models/user')
const cookieToken=require('../utils/cookieToken')
const cloudinary=require('cloudinary')

exports.signup=BigPromise(async(req,res, next)=>{
    console.log("signup")

    const {email,password,name}=req.body;
    
    if(!email || !password || !name){
        return next(new Error("email,name,password are required. One or more are missing"))
    }
    let result;
    if(!req.files){
        return next(new Error("profile photo missing"))
    }
    let file=req.files.photo   
    result=await cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"User Profile"})

    const user=await User.create({
        email:email,
        password:password,
        name:name,
        photo:{
            id:result.public_id,
            secure_url:result.secure_url,
        }
    });

   await cookieToken(user,res);
})