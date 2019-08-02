const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function(req,res){

    let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path:"comments",
       populate: {
        path:"user"
      }
    });

    return res.json(200,{
        message: "list of posts",
        posts: posts
    })
}


// deleting a post(Autherized)
module.exports.destroy= async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        
     
        // .id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();


            await Comment.deleteMany({post:req.params.id});
                

                // if(req.xhr){
                //     return res.status(200).json({
                //         data:{
                //             post_id: req.params.id
                //         },
                //         message:"Post Deleted"
                //     })
                // }

                    // req.flash("success","Post & associated comments deleted!");
                return res.json(200,{
                    message: "post and associated comments deleted successfully!"
                });
            // })
        } else {
            // req.flash("error","you cannot delete this post!");
            return res.json(401,{
                message:"you cannot delete this post!"
            });
        }
    }catch(err){

        console.log("***********",err);
    
    // req.flash("error",err);
    // return res.redirect("back");
    return res.json(500, {
        message: "internal server error"
    });
    }
}