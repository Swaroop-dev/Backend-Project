const {getPaymentPublishKey}=require("../controllers/paymentController")
const express=require('express')
const { isLoggedIn } = require("../middlewares/user")
const route=express.Router()



route.route("/payment/getPublishKey",isLoggedIn,getPaymentPublishKey)


module.exports=route