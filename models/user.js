const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const userSchema = new  mongoose.Schema(  {
    name :{
        type : String,
        required: true
    },
    email : {
        type : String,
        required : true
    },
    password  : {
        type : String,
        required : true
    },
    resetToken : {type :  String},
    expireToken : {type : Date},
    followers :[{type:ObjectId, ref : "User"}],
    following :[{type:ObjectId, ref : "User"}],
    pic :{
        type: String,
        default : "https://res.cloudinary.com/dpfugowzy/image/upload/v1594732605/noprofile_q54y5a.jpg"
    }
})

module.exports = mongoose.model ("User",userSchema)