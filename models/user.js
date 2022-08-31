import mongoose from 'mongoose';
const { Schema,model } = mongoose;


const userSchema=new Schema({
    name:{
        type: 'string',
        required: true,
    }
})

module.exports=model('user',userSchema);