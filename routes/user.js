const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require ('../middleware/requireLogin')
const user = require('../models/user')
const Post = mongoose.model("Post")
const User = mongoose.model("User")


//profile of other user
router.get('/user/:id', requireLogin,(req,res) => {
    User.findOne ({_id : req.params.id}) //parameters of the user name, email etc..,
    .select ("-password")//we dont require password so -password
    .then(user => {
        Post.find({postedBy : req.params.id})
        .populate("postedBy","_id name")
        .exec ((err,posts) => {
            if (err) {
                return res.json({error:err})
            }
            res.json({user,posts})
        })
    }).catch (err => {
        return res.json({error : "No User exists with this name"})
    })
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{  //finding the id which want to follow
        $push:{followers:req.user._id}  //updataing the other user followers
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}   //updating the logged in user following
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
        User.findByIdAndUpdate(req.body.unfollowId,{    //finding the id to unfollow    
            $pull:{followers:req.user._id}  //removing the follwers of other user
        },{
            new:true
        },(err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}   //removing the following of logged in user
            
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })

        })
})


router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})


router.post ('/searchusers',(req,res) => {
    let userPattern = new RegExp('^'+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user => {
        res.json({user})
    }).catch(err => {
        console.log (err)
    })

})




module.exports = router