const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    fullname:{type:String},
    phone:{type:String},
    email:{type:String},
    password:{type:String}

},{timestamps:true})


const usermodel = new mongoose.model("user_tbls",userSchema)
module.exports=usermodel
