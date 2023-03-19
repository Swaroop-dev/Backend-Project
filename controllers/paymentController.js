const { stripePublishKey } = require("../Config/config");
const BigPromise = require("../middlewares/BigPromise");

exports.getPaymentPublishKey=BigPromise((req,res,next)=>{
    return res.status(200).json({key:stripePublishKey
    })
})