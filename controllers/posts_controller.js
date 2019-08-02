// Saving Posts to DB
const Post = require("../models/post");

const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function(req,res){
    try{
        // await  Post.create({
           let post =  await  Post.create({
            content: req.body.content,
            user: req.user._id

        });


           if(req.xhr){

            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

               return res.status(200).json({
                   data:{
                       post: post
                   },
                   message:"Post Created!"
               });
           }

            req.flash("success","Post published!");

            return res.redirect("back");
    }catch(err){
        // console.log("Error",err);
        req.flash("error",err);
        // added this to view the error on console as well
        console.log(err);
        return  res.redirect("back"); 

    }
}
// await  Post.create({
    // content: req.body.content,
    // user: req.user._id
// },function(err,post){
    // if(err){
        // console.log("error in creating a post");
        // return;
    // }
    // return res.redirect("back");
// });
    


    // deleting a post(Autherized)
    module.exports.destroy= async function(req,res){
        try{
            let post = await Post.findById(req.params.id);
            // ,function(err,post){
         
            // .id means converting the object id into string
            if(post.user == req.user.id){

            //   CHANGE:: delete the associated likes for the post & all its comments ,likes too
                await Like.deleteMany({likeable: post, onModel: "Post" });
                await Like.deleteMany({_id: {$in: post.comments}});


                post.remove();


                await Comment.deleteMany({post:req.params.id});
                    // ,function(err){

                    if(req.xhr){
                        return res.status(200).json({
                            data:{
                                post_id: req.params.id
                            },
                            message:"Post Deleted"
                        });
                    }

                        req.flash("success","Post & associated comments deleted!");
                    return res.redirect("back");
                // })
            } else {
                req.flash("error","ypu cannot delete this post!");
                return res.redirect("back");
            }
        }catch(err){
        // console.log("Error",err);
        req.flash("error",err);
        return res.redirect("back");
        }
    }
    //     let post = await Post.findById(req.params.id);
    //         // ,function(err,post){
         
    //         // .id means converting the object id into string
    //         if(post.user == req.user.id){
    //             post.remove();


    //             await Comment.deleteMany({post:req.params.id});
    //                 // ,function(err){
    //                 return res.redirect("back");
    //             // })
    //         } else {
    //             return res.redirect("back");
    //         }
    //     // });
    // // }
