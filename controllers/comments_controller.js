// adding comments to DB(comments controller)
const Commment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");
const Like = require("../models/like");

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        // ,function(err,post){
        if(post){
            let comment = await Commment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });

            // },function(err,comment){
                // handle error

                post.comments.push(comment);
                post.save();

                comment = await comment.populate("user", "name email").execPopulate();
                // commentsMailer.newComment(comment);

                let job = queue.create("emails",comment).save(function(err){
                    if(err){
                        console.log("error in sending to the queue",err);
                        return;
                    }
                    console.log("job enqueued",job.id);
                });

                if(req.xhr){
                    // similar for comments to fetch the user's id!
                    // comment = await comment.populate("user", "name").execPopulate();

                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message: "Post created!"
                    });
                }
                req.flash('success', 'Comment published!');

                res.redirect("/");
            // });
        }

    }catch(err){
        req.flash('error', err);
        // console.log("Error",err);
        return;
      }
    }

    
    // let post = await Post.findById(req.body.post);
    //     // ,function(err,post){
    //     if(post){
    //         let comment = await Commment.create({
    //             content:req.body.content,
    //             post:req.body.post,
    //             user:req.user._id
    //         });

    //         // },function(err,comment){
    //             // handle error

    //             post.comments.push(comment);
    //             post.save();

    //             res.redirect("/");
    //         // });
    //     }
    // });
// }

module.exports.destroy = async function(req,res){
    try{
        let comment = await Commment.findById(req.params.id);
        // ,function(err,comment){
        if(comment.user == req.user.id){
            let postId = comment.post;

             comment.remove();

             let post = Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}});

            //  CHANGE:: destroy the associated likes for this comment
             await Like.deleteMany({likeable: comment._id, onModel: "Comment"});

                // ,function(err,post){

                // send the comment id which was deleted back to the views
                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            comment_id: req.params.id
                        },
                        message: "Post deleted"
                    });
                }
                    req.flash('success', 'Comment deleted!');
                 return  res.redirect("back");
            //  })
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect("back");
        }
    // });


    }catch(err){
        req.flash('error', err);
    return;
  }
}
//     let comment = await Commment.findById(req.params.id);
//         // ,function(err,comment){
//         if(comment.user == req.user.id){
//             let postId = comment.post;

//              comment.remove();

//              let post = Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}});
//                 // ,function(err,post){
//                  return  res.redirect("back");
//             //  })
//         } else {
//             return res.redirect("back");
//         }
//     // });
// }

