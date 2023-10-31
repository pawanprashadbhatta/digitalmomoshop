const mongoose=require("mongoose")
exports.connectdatabase=async(URI)=>{
    await mongoose.connect(URI)
    console.log("database connected successfully💞")
}