const express=require('express')
const route=express.Router()

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

module.exports=route;