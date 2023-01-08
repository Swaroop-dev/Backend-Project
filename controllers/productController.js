const BigPromise=require('./../middlewares/BigPromise')
const User=require('./../models/user')
const Product=require('./../models/product')
const cookieToken=require('../utils/cookieToken')
const cloudinary=require('cloudinary')
const mailHelper=require('../utils/emailHelper')


exports.addProduct=BigPromise(async(req, res, next)=>{
    let images=[]

    if(req.files==0){
        //handle request
        res.status(400).json({message:"Images of the product is required"})
    }

    for(let i=0;i<req.files.photo.length;i++){
        let result=await cloudinary.upload(req.files.photo[i].tempFilePath,{folder:"Product gallery"})
        images.push({
            id:result.public_id,
            secure_url:result.secure_url
        })
    }
    req.body.photos=images
    req.body.user=req.user._id

    const product=await Product.createCollection(req.body)

    res.status(200).json({message:"Product created successfully",product})

})


exports.getAllProduct=BigPromise(async(req, res, next)=>{
    const products=await Product.find()

    res.status(200).json({listOfProducts:products})
})


exports.getAllProductById=BigPromise(async(req, res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product) {
        res.status(404).json({message:"Product not found"})
    }

    res.status(200).json({product:product})
})


exports.updateProductById=BigPromise(async(req, res,next)=>{
    //handleing image update

    const product=await Product.findById(req.params.id)

    if(!product){
        res.status(400).json({message:"product doesnt exist"})
        return
    }

    if(req.files>0){
        //deleting existing images

        for(let i=0;i<product.photos.length;i++){
            const res=await cloudinary.v2.uploader.destroy(product.photos[i].id);
        }
        for(let i=0;i<req.files.photo.length;i++){
            let result=await cloudinary.upload(req.files.photo[i].tempFilePath,{folder:"Product gallery"})
            images.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }
        req.body.photos=images
 
    }

    
    req.body.user=req.user._id

    const updatedproduct=await Product.findByIdAndUpdate(product._id,req.body)
    res.status(204).json({message:"Product created successfully",updatedproduct})
    
})