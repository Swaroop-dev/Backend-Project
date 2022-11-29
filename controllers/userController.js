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


exports.login=BigPromise(async(req, res, next)=>{
    const {email,password}=req.body
    //required fields validation
    if(!email || !password){
        return res.status(400)
    }

    //fetch user
    const user=await User.findOne({email:email}).select("+password")

    if(!user){
        return next( new Error("account with this email does not exist.create account first or try with other email"))
    }
    //verify password
    const match=await user.validatePassword(password)
    if(!match){
        return next(new Error("Email and password do not match"))
    }

    await cookieToken(user,res)
});

exports.logout=BigPromise(async(req, res, next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({message:"successfully logged out"})
})