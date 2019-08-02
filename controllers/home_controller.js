const Post = require("../models/post");
const User = require("../models/user");
// Create a Controller

// converting to async await + error handling
module.exports.home =  async function(req,res){
  try{
    // populate the user of each post  // nested population
    let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path:"comments",
       populate: {
        path:"user"
      },
      // Change :: populate the likes of each post & comment
      populate: {
        path: "likes"
      }

    }).populate("likes");
    
    // .exec(function(err,posts){

         let users = await User.find({});
          // ,function(err,users){
         return res.render("home",{
           title:"Codeial | Home",
           posts: posts,
           all_users: users
         });

  } catch(err){
    console.log("Error",err);
    return;
  }

    // create view for home
    // return res.end("<h1> Express is up for Codeial!</h1>");
      // console.log(req.cookies);
      // res.cookie("user_id",25);
      
      //  display posts
    // Post.find({},function(err,posts){
      // return res.render("home",{
        // title:"Codeial | Home",
        // posts:posts
      // });
    // });
      }


    // return res.render("home",{
        // title:"Home"                (cut copy above)
    // });
// }

// module.exports.actionName=function(req,res){}







