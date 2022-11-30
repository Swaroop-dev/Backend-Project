const cookieToken=(user,res)=>{
    const token=user.generateJwt()
    

    const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true
    }
    
    return res.cookie("token",token,options).json(user)
}

module.exports=cookieToken
