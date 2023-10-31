const express=require("express")
const { connectdatabase } = require("./database/database")
const User = require("./model/userModel")
const app=express()
//tell node to use dotenv
require("dotenv").config()
const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(express.urlencoded({extended:true}) )  //form bata aako data lai parse gareko natra undefined aauxa
const bcrypt =require("bcryptjs")
connectdatabase(process.env.MONGO_URI)
//envoked database connection to app.js
//TEST API TO CHECK IF SERVER IS LIVE OR NOT
app.get("/",(req,res)=>{
    res.status(201).json({
        status:200,
        message:"i am live"
        ,auther:"pob"
    })
})
//register user api
app.post("/register",async(req,res)=>{
   // console.log(req.body)  //frontend bata data aako show garna lai console ma to test if it is hitting api or not , but undefined falxa so 2 line ko code we weite in6,7
    const {email,password,phoneNumber,userName}=req.body
    //destructuring data coming from frontend to put into database
    if(! email || ! password || !phoneNumber || !userName){ 
       return res.status(400).json({
message:"Please provide complete details.."
    })
}
    //return lekyo vane else part skip garna milxa like just above
    // else
    
 //check email already exist in database or not..
 const userFound=await User.find({userEmail:email})
 if(userFound.length>0){
   return  res.status(401).json({
         message:"user with provided email is already registered please login.."
     })
 }

    //below code vaneko User.create vanya 
    //User vaneko model ho .create vanya database ko ma halna lai gareko front end ko data
    //schema ko field ma ui ko field value halna tala key value pair jastai not key value pair,but xan tyo le match hunxa

    await User.create({
        userName:userName,
        userEmail:email,
        password:bcrypt.hashSync(password,10),//salt value badi rakda hamro cpu le vyaudaina so 10 12 vanda kam raknae 20 rakyo vne laptop hamro thamdaina 
        userPhoneNumber:phoneNumber
    })
    res.status(201).json({
      message:"user registered successfully.."
    })
   
})
//user login api
app.post("/login",async(req,res)=>{
const {email,password}=req.body
if(!email || !password)
    {
    return res.status(400).json({
        message:"please provide email and password"
    })
   }
   const userFound=await User.find({userEmail:email})
   if(userFound.length==0){
    return res.status(404).json({
        message:"user with that email is not registeresd"
    })}
  // password check 
  const isMatched = bcrypt.compareSync(password,userFound[0].password)
  if(isMatched){
     // generate token 
     const token = jwt.sign({id : userFound[0]._id},process.env.SECRET_KEY,{
        expiresIn : '30d'
       })
       res.status(200).json({
        message : "User logged in successfully",
        token
    })
  }

  else{
    res.status(404).json({
        message : "Invalid Password"
    })
  }
})

 const PORT= process.env.PORT
//LISTEN SERVER
app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`)
})