const BigPromise=require('./../middlewares/BigPromise')
const User=require('./../models/user')
const jwt=require("jsonwebtoken")
const {secretkey}=require('../Config/config')


exports.isLoggedIn=BigPromise(async(req,res,next)=>{
    const token=req.cookie || req.header("Authorization").replace('Bearer ','')
    if (!token) return next("User has not logged In")
    
    const {id}=jwt.verify(token,secretkey)
    console.log(id)
    req.user=await User.findById(id)
    next()
})

exports.customRoleChecker=(...roles)=>{
    return (req,res,next) => {
        
        if(!roles.includes(req.user.role)){
            res.status(400).json({message:"user doesnt have previliges"})
            return
        }
        next()
    }
   
   
}