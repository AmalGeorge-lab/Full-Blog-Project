const User = require('../models/User.js');
const Post = require('../models/Post.js');
const File = require('../models/File.js');
const Comment = require('../models/Comment.js');
const cloudinary = require('../config/cloudinary.js');


exports.getUserProfile = async (request,response)=>{
    const user = await User.findById(request.user._id).select("-password");
    if(!user){
        response.render("login" , { title : "Login" , user : request.user , error : "User not found" });
    }
    response.render("profile" , { title : "Profile" , user });
}


exports.getEditProfileForm = async (request,response)=>{
    const user = await User.findById(request.user._id).select("-password");
    if(!user){
        response.render("login" , { title : "Login" , user : request.user , error : "User not found" });
    }
    response.render("editprofile" , { title : "Edit Profile" , user , message : "" });
}


exports.updateProfile = async (request,response)=>{
    const { username , email , bio } = request.body;
    const user = await User.findById(request.user._id).select("-password");
    if(!user){
        response.render("login" , { title : "Login" , user : request.user , error : "User not found" });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    if(request.file){
        if(user.profilePicture && user.profilePicture.public_id){
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
        }
    }
    const file = new File({
        url : request.file.path ,
        public_id : request.file.filename ,
        uploaded_by : request.user._id
    });
    await file.save();
    user.profilePicture = {
        url : file.url ,
        public_id : file.public_id
    }
    await user.save();
    response.render("editProfile" , { title : "Edit Profile" , user , error : "" , message : "Updated Successfully" })
}



exports.deleteUser = async (request,response)=>{
    const user = await User.findById(request.user._id).select("-password");
    if(!user){
        response.render("login" , { title : "Login" , user : request.user , error : "User not found" });
    }
    if(user.profilePicture && user.profilePicture.public_id){
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    const posts = await Post.find({ author : request.user._id });
    posts.forEach( async (post)=>{
        post.images.forEach( async (image)=>{
            await cloudinary.uploader.destroy(image.public_id);
        });
        await Comment.deleteMany({ post : post._id });
        await Post.findByIdAndDelete(post._id);
    });
    await Comment.deleteMany({ author : request.user._id });

    const files = await File.find({ uploaded_by : request.user._id });
    files.forEach( async (file)=>{
        await cloudinary.uploader.destroy(file.public_id);
    });
    await User.findByIdAndDelete(request.user._id);
    response.redirect("/auth/register");
}