const mongoose=require('mongoose');
const { Schema,model } = mongoose;


const userSchema=new Schema({
    name:{
        type:'string',
        required: true,
    },
    email:{
        type:'string',
        required: true,
        
    },
    password:{
        type:'string',
        required: true,
    }
    
})

module.exports=model('user',userSchema);