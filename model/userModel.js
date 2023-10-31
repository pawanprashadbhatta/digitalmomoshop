const mongoose=require("mongoose")
const Schema=mongoose.Schema
const userSchema=new Schema({
    
    userName:{
        type:String,
        required:[true,"please enter your name"]
    },
    userEmail:{
        type: String,
        required:[true,'email is mendatory']
    },
    password:{
        type:String,
        required:[true,"please enter your password"]
    },
    userPhoneNumber:{
        type:String,
        required:[true,'please provide ur phone number']
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    }

})
const User=mongoose.model("User",userSchema)
module.exports=User