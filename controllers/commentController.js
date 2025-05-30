const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');


exports.addComment = async (request,response)=>{
    const { content } = request.body;
    const postId = request.params.id;
    const post = await Post.findById(postId);
    if(!post || !content){
        return response.render("post" , { title : "Post" , post , user : request.user });
    }
    const comment = new Comment({
        content ,
        post : postId ,
        author : request.user._id
    });
    //console.log(comment);
    await comment.save();
    post.comments.push(comment?._id);
    await post.save();
    response.redirect(`/posts/${postId}`);
}


exports.getCommentForm = async (request,response)=>{
    const comment = await Comment.findById(request.params.id);
    response.render("editComment" , { title : "Comment" , comment , user : request.user });
}


exports.updateComment = async (request,response)=>{
    const { content } = request.body;
    const comment = await Comment.findById(request.params.id);
    comment.content = content || comment.content;
    await comment.save();
    response.redirect(`/posts/${comment.post}`);
}


exports.deleteComment = async (request,response)=>{
    const comment = await Comment.findById(request.params.id);
    await Comment.findByIdAndDelete(request.params.id);
    response.redirect(`/posts/${comment.post}`);
}