const mongoose = require ('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema ({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    postedBy : {
        type : ObjectId, //Id of the user who has created post
        ref : "User"
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        type:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
},{timestamps:true})

mongoose.model("Post",postSchema)