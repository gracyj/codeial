const User = require("../models/user");
const fs = require("fs");
const path = require("path");
// create another Controller 


// let's keep it same as before
module.exports.profile = function(req,res){

User.findById(req.params.id, function(err,user){

// res.end("<h1>USER PROFILE</h1>");
return res.render("user_profile",{
    title:"User Profile",
    profile_user: user
      });
  });
}

// update user profile

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
        //  req.flash("succes","updated");
    //         return res.redirect("back");
    //     });
    // } else {
        //   req.flash("error","unautherized")
    //     return res.status(401).send("Unauthorized");
    // }
    if(req.user.id == req.params.id){
        try{
          
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
               if(err){
                   console.log("*****Multer Error:", err)
               }
            //    console.log(req.file);
              user.name = req.body.name;
              user.email = req.body.email;

              if(req.file){

               if(user.avatar){
                  fs.unlinkSync(path.join(__dirname, "..", user.avatar));
               }


                //   this is saving the path of the uploaded file into the avatar field in the user
                  user.avatar = User.avatarPath + "/" + req.file.filename;
              }
              user.save();
              return res.redirect("back");
            });

        }catch{
            req.flash("error",err);
         return res.redirect("back");
        }


    }else{
        req.flash("error","unautherized");
        return res.status(401).send("Unauthorized");
    }
}



// rendering Pages for Sign up ( add action),render the sign up page!

module.exports.signUp = function(req,res){
    
    // restricting page access
    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }
    
    
    return res.render("user_sign_up",{
        title:"codeial | Sign UP"
    })
}


// rendering Pages for Sign in ( add action)
module.exports.signIn = function(req,res){

    // restricting page access
    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }


    return res.render("user_sign_in",{
        title:"codeial | Sign IN"
    })
}

// get the sign up data(user sign up)
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect("back");
    }
   
    User.findOne({email:req.body.email}, function(err,user){
         if(err){ console.log("error in finding user in signing up"); return }
             
         if(!user){
             User.create(req.body,function(err,user){
                if(err){ console.log("error in creating user while signing up"); return }

                return res.redirect("/users/sign-in");  
          })
         } else {
            return res.redirect("back");  
         }
     });
    
    }


// sign in & create a session for the user
module.exports.createSession = function(req,res){
    req.flash("success","logged in successfully");
    return res.redirect("/");
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash("success","logged out successfully");
    return res.redirect("/");
}




