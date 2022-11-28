const cookieToken=(user,res)=>{
    const token=user.generateJwt()
    console.log(token)

    const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true
    }
    console.log("after jwt")
    return res.cookie("token",token,options).json(user)
}

module.exports=cookieToken
