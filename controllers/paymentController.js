const { stripePublishKey, stripeSecretKey } = require("../Config/config");
const BigPromise = require("../middlewares/BigPromise");

const stripe = require('stripe')(stripeSecretKey)

exports.getPaymentPublishKey=BigPromise((req,res,next)=>{
    return res.status(200).json({key:stripePublishKey
    })
})


exports.paymentInit=BigPromise(async(req,res,next)=>{
    const {price}=req.body
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
      });
    
      res.status(200).json({message:" payment successful"});
    }
)