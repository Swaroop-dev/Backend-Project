const cookieToken=(user,res)=>{
    const token=user.generateJwt()
    //console.log(generateJwt)

    const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true
    }

    res.status(204).cookie("token",token,options).json({token,user,message:"user created"})
}

module.exports=cookieToken
