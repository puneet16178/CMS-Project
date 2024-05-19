const mongoose=require('mongoose')

let regSchema=mongoose.Schema({
    email:String,
    password:String,
    firstname:String,
    lastname:String,
    mobile:Number,
    role:{type:String,default:'free'},
    desc:String,
    img:{type:String,default:'defaultimg.jpg'},
    creationDate:{type:Date,default:Date.now},
    status:{type:String,default:'suspended'}
})


module.exports=mongoose.model('reg',regSchema)