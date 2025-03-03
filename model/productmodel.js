import mongoose from 'mongoose';
import usermodel from './usermodel.js';
const productSchema = new mongoose.Schema({
   userid:{type:mongoose.Schema.Types.ObjectId,ref:usermodel},
    title: {type:String},
    price: {type:String},
    description: {type:String},
    category:{type:String},
    stock:{type:String},
    rating: {type:Number},
    image:{type:String},  
  },{timestamps:true});
  
  const productmodel = mongoose.model('product_tbl', productSchema);
  
  module.exports=productmodel