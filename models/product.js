const mongoose=require('mongoose');
const { Schema,model } = mongoose;
const validator = require('validator');
const bcrypt=require('bcryptjs');
const {secretkey}=require("./../Config/config")
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const productSchema =new Schema({
    name:{
        type:String,
        required:[true,"name of the product required"],
        trim:true,
        maxlen:[255,'name of product should not be more than 255 characters']
    },
    price:{
        type:Number,
        required:[true,'prcie of the product is required']
    },
    description:{
        type:String,
        required:[true,'please provide a description of the product'],
        minlen:[10,'A description should be at least 10 characters']
    },
    photos:[{
        id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,'please provide a category of the product'],
        enum:{
            values:['short-sleaves','long-leaves','sweat-shirt','hoodies']
        }
    },

    brand:{
        type:String,
        required:[true,'Please add a brand for clothing']
    },
    ratings:{
        type:Number,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                requierd:true
            },
            rating:{
                type:Number,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps: true})


module.exports=model('Product',productSchema);