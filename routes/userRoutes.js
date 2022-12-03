const express=require('express')
const route=express.Router()
const {signup,login,logout,forgotPassword,resetPassword,getUserDetails,changePassword,updateUserDetails,getAllUsers}=require('../controllers/userController')
const { isLoggedIn,customRoleChecker } = require('../middlewares/user')


route.route('/').get(function (req, res, next) {
    res.status(200).json({
        message:"getting started"
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
route.route('/userDetails/update').post(isLoggedIn,updateUserDetails)

route.route('/users').get(isLoggedIn,customRoleChecker("Admin"),getAllUsers)

module.exports=route;