const BigPromise=require('./../middlewares/BigPromise')
const User=require('./../models/user')
const Product=require('./../models/product')
const cookieToken=require('../utils/cookieToken')
const cloudinary=require('cloudinary')
const mailHelper=require('../utils/emailHelper')
const user = require('./../models/user')


exports.addProduct=BigPromise(async(req, res, next)=>{
    let images=[]

    if(!req.files){
        //handle request
        res.status(400).json({message:"Images of the product is required"})
    }

    for(let i=0;i<req.files.photo.length;i++){
        let result=await cloudinary.v2.uploader.upload(req.files.photo[i].tempFilePath,{folder:"Product gallery"})
        images.push({
            id:result.public_id,
            secure_url:result.secure_url
        })
    }
    req.body.photos=images
    req.body.user=req.user._id

    const product=await Product.create(req.body)

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

    if(req.files){
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
    res.status(204).json({message:"Product updated successfully",updatedproduct})
    
})


exports.deleteProductbyId=BigPromise(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)

    if(!product){
        res.status(400).json({message:"product doesnt exist"})
        return
    }

    if(product.photos>0){
        //deleting existing images

        for(let i=0;i<product.photos.length;i++){
            const res=await cloudinary.v2.uploader.destroy(product.photos[i].id);
        }
        
 
    }

    


    await product.remove()
    res.status(200).json({message:"Product deleted successfully"})
    
})

exports.addReviewForProductyId=BigPromise(async(req,res,next)=>{
    if (!req.params.id){
        res.status(400).json({message:"product Id required to add review"})
        return

    }

    const product =await Product.findById(req.params.id)
    if (!product){
        res.status(404).json({message:`Product with ${req.params.id} is not found`})
        return
    }
    const {rating}=req.body
    const userReview={
        user:req.user._id,
        name:req.user.name,
        rating:parseInt(rating)

    }
    console.log(userReview)
    const checkIfAlreadyReviewed=product.reviews.find(it=>it.user.toString()==req.user._id.toString())

    if (checkIfAlreadyReviewed){
        product.reviews.forEach(rev=>{
            console.log(rev)
            if(rev.user._id.toString()==userReview.user.toString()){
                rev.rating=userReview.rating
        }
    })
    
    }


    else{
       product.reviews.push(userReview);
       product.numberOfReviews=product.numberOfReviews+1
       if(product.numberOfReviews==1){
            product.ratings=userReview.rating
       }
       else{
        product.ratings=product.ratings+(user.rating/(product.numberOfReviews-1))
       }
       
    }
    await product.save()
    res.status(204).json({message:"user review updated successfully"})




})


exports.getReviewForProductById=BigPromise(async(req,res,next)=>{
    const {id}=req.params
    if (!id){
        return res.status(400).json({message:"Product id not sent as part of request"})
    }

    const product=await Product.findById(id);
    if(!product){
        return res.status(400).json({message:"product with that id is not found"})
    }

    return res.status(200).json({message:"Product review success",data:product.reviews})

})