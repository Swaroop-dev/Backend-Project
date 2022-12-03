const mongoose=require('mongoose');
const { Schema,model } = mongoose;
const validator = require('validator');
const bcrypt=require('bcryptjs');
const {secretkey}=require("./../Config/config")
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userSchema=new Schema({
    name:{
        type:'string',
        required: [true,'Name is required'],
        maxlength:255
    },
    email:{
        type:'String',
        required: true,
        unique: true,
        validate:[validator.isEmail,"Please provide a valid email"]
        
    },
    password:{
        type:'string',
        required: [true,'please provide password'],
        minlength:8,
        select:false
    },
    isSeller:{
        type:'boolean',
        default: false,
    },
    phoneNumber:{
        type:'number',
        //required: true,
        unique: true,
    },
    photo:{
        id:{
            type:'string',
            //required: true,
        },
        secure_url:{
            type:'string',
            //required: true,
        }
    },
    forgotPasswordToken:{
        type:String,
        default:undefined
    },
    forgotPasswordTokenexpiry:{
        type:Date,
        default:undefined,

    },
    role:{
        type:'string',
        default:"buyer"
    }


},{ timestamps: true })

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    this.password=await bcrypt.hash(this.password,10)
})


userSchema.methods={
    validatePassword:async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },

    generateJwt: function(){
        return  jwt.sign({id:this._id},secretkey,{
            expiresIn:'20d'
        })
    },
    
    forgotPassword: function(){
        this.forgotPasswordToken=crypto.randomBytes(20).toString('hex')
        //set expiry time for token
        this.forgotPasswordTokenexpiry=Date.now()+20*60*60*24
        
        return this.forgotPasswordToken
    }
}



module.exports=model('User',userSchema);