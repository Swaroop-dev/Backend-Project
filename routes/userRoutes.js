const express=require('express')
const route=express.Router()
const {signup,login}=require('../controllers/userController')

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

module.exports=route;