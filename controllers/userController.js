const BigPromise=require('./../middlewares/BigPromise')
const User=require('./../models/user')
const cookieToken=require('../utils/cookieToken')
const cloudinary=require('cloudinary')
const mailHelper=require('../utils/emailHelper')

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

exports.forgotPassword=BigPromise(async(req, res, next)=>{
    const {email}=req.body

    const user=await User.findOne({email:email})
    // console.log(user)

    const forgottoken=await user.forgotPassword()
    // console.log(forgottoken)
    user.forgotPasswordToken=forgottoken
    await user.save()

    const Url=`${req.protocol}://${req.get("host")}/password/reset/${forgottoken}`

    const link=`open this link -- ${Url} url in your browser`

    try {
        await mailHelper({email:user.email,subject:"Reset passowrd",link:link})
        res.status(200)
        res.json({user,message:"email sent successfully"})
        
    } catch (error) {
        user.forgotPasswordToken=undefined
        user.forgotPasswordTokenexpiry=undefined
        res.status(400).json({error})
        await user.save()
    }
})

exports.resetPassword=BigPromise(async(req, res, next)=>{
    const token = req.params.token

    if (!token){
        res.status(400)
        res.json({message:"token missing"})
        return
    }

    const user=await User.findOne({
        forgotPasswordToken:token,
        forgotPasswordTokenexpiry:{$gt:Date.now()}
    })

    if (!user){
        return next(new Error("token as expired"))
    }

    const {password,confirmpassword}=req.body

    if(password!=confirmpassword){
        //reject the request
    }

    user.password=password

    //big fix
    user.forgotPasswordToken=undefined
    user.forgotPasswordTokenexpiry=undefined

    await user.save()
    res.status(200).json({message:"password changed successfully"})


    
})

exports.changePassword=BigPromise(async(req,res,next)=>{
    const {_id}=req.user
    const {password,newPassword}=req.body

    const user=await User.findById(_id).select("+password")
    const Ismatch=user.validatePassword(password)
    if (!Ismatch){
        res.json(400).json({message:"old password is incorrect"})
        return
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({message:"password changed successfully"})
})

exports.getUserDetails=BigPromise(async(req,res,next)=>{
    res.status(200).json(req.user)
})


exports.updateUserDetails=BigPromise(async(req,res,next)=>{
    const {_id}=req.user

    const newData={
        name:req.body.name,
        email:req.body.email,
    }

    if(req.files){
        const photoId=req.user.photo.id
        await cloudinary.v2.uploader.destroy(photoId)

        
        const result=await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath,{folder:"User Profile"})
        newData.photo={
            id:result.public_id,
            secure_url:result.secure_url
        }
    }

    const user=await User.findByIdAndUpdate(_id,newData,{
        new:true,
        runValidators:true
    })

    res.status(200).json({message:"user details updated successfully"})
})


exports.getAllUsers=BigPromise(async(req, res, next)=>{
    const users =await User.find()
    res.status(200).json({users})
})

exports.getUserAdmin=BigPromise(async(req, res, next)=>{
    const userid=req.params.userId

    const user=await User.findById(userid)

    if(!user){
        res.status(400).json({message:"user not found"})
        return
    }

    res.status(200).json(user)

})

exports.deleteUserAdmin=BigPromise(async(req, res, next)=>{
    const userid=req.params.userId

    const user=await User.findById(userid)

    if(!user){
        res.status(400).json({message:"user not found"})
        return
    }

    const tempresult=await cloudinary.v2.destroy(result.photo.id)

    const result=await User.deleteOne({_id:userid})

    res.status(200).json({message:"user deleted successfully"})
})