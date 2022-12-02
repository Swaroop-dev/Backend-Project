const express=require('express')
const route=express.Router()
const {signup,login,logout,forgotPassword,resetPassword,getUserDetails,changePassword}=require('../controllers/userController')
const { isLoggedIn } = require('../middlewares/user')


route.route('/').get(function (req, res, next) {
    res.status(200).json({
        message:"getting started"
    })
  })

  
route.route('/users').get(function (req, res, next) {
    res.status(200).json({
        message:"you are at users end point"
    })
  })

route.route('/signup').post(signup)

route.route('/login').post(login)
route.route('/logout').get(logout)
route.route('/forgotpassword').post(forgotPassword)

route.route('/password/reset/:token').post(resetPassword)
// route.route('/changepassword').post(changePassword)

route.route('/userDetails').get(isLoggedIn,getUserDetails)
route.route('/userDetails/update/password').post(isLoggedIn,changePassword)

module.exports=route;