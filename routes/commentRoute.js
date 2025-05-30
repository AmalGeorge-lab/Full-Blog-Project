const express = require('express');
const commentRoute = express.Router();
const { isAuthenticated } = require('../config/token.js');
const { addComment , getCommentForm , updateComment , deleteComment } = require('../controllers/commentController.js');


commentRoute.post('/posts/:id/comments' , isAuthenticated , addComment);

commentRoute.get('/:id/comment/edit' , isAuthenticated , getCommentForm);

commentRoute.post('/comment/:id/update' , isAuthenticated , updateComment);

commentRoute.get('/:id/comment/delete' , isAuthenticated , deleteComment);

module.exports = commentRoute;