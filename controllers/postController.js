const Post = require('../models/Post.js');
const File = require('../models/File.js');
const cloudinary = require('../config/cloudinary.js');

exports.getPostForm = (request,response)=>{
    response.render("newPost" , { title : "Create Post" , user : request.user , error : "" , success : "" });
}

exports.createPost = async (request,response)=>{
    const { title , content } = request.body;
    console.log(request.files);
    console.log(request.user);
    if(!request.files || request.files.length === 0){
        return response.render("newPost" , { title : "Create Post" , user : request.user , error : "At least one image is required" , success : "" });
    }
    const images = await Promise.all(request.files.map(async (file)=>{
        // save the images into db
        const newFile = new File({
            url : file.path ,
            public_id : file.filename ,
            uploaded_by : request.user._id
        });
        await newFile.save();
        return {
            url : newFile.url ,
            public_id : newFile.public_id
        }
    }));

    // create the post
    const newPost = new Post({
        title ,
        content ,
        author : request.user._id ,
        images
    });
    await newPost.save();
    response.render("newPost" , { title : "Create Post" , user : request.user , success : "Post created successfully" , error : "" });
}

exports.getPosts = async (request , response)=>{
    const posts = await Post.find().populate("author" , "username");
    //console.log(posts);
    response.render("posts" , { title : "Posts" , posts , user : request.user });
}


exports.getPostById = async (request,response)=>{
    //console.log(request.params.id)
    const post = await Post.findById(request.params.id).populate("author","username").populate({
        path : "comments" ,
        populate : {
            path : "author" ,
            model : "User" ,
            select : "username"
        }
    });
    //console.log(post);
    response.render("post" , { title : "Post" , post , user : request.user });
}


exports.getEditPostForm = async (request,response)=>{
    const post = await Post.findById(request.params.id);
    response.render("editPost" , { title : "Edit Post" , post , user : request.user });
}


exports.updatePost = async (request,response)=>{
    const { title , content } = request.body;
    const post = await Post.findById(request.params.id);
    if(!post){
        return response.render("post" , { title : "Post" , post , user : request.user })
    }
    if(post.author.toString() !== request.user._id.toString()){
        return response.render("post" , { title : "Post" , post , user : request.user })
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    if(request.files){
        await Promise.all(post.images.map(async (image)=>{
            await cloudinary.uploader.destroy(image.public_id);
        }));
    }
    post.images = await Promise.all(request.files.map(async (file)=>{
        const newFile = new File({
            url : file.path ,
            public_id : file.filename ,
            uploaded_by : request.user._id
        });
        await newFile.save();
        return {
            url : newFile.url ,
            public_id : newFile.public_id
        }
    }));
    await post.save();
    response.redirect(`/posts/${post._id}`);
}


exports.deletePost = async (request , response)=>{
    const post = await Post.findById(request.params.id);
    if(!post){
        return response.render("post" , { title : "Post" , post , user : request.user })
    }
    if(post.author.toString() !== request.user._id.toString()){
        return response.render("post" , { title : "Post" , post , user : request.user })
    }
    await Promise.all(post.images.map(async (image)=>{
        await cloudinary.uploader.destroy(image.public_id);
    }));
    await Post.findByIdAndDelete(request.params.id);
    response.redirect("/posts");
}