const express = require('express');
const { getPostForm, createPost, getPosts , getPostById , getEditPostForm , updatePost , deletePost } = require('../controllers/postController');
const postRoutes = express.Router();
const { isAuthenticated } = require('../config/token.js');
const upload = require('../config/multer.js');


postRoutes.get('/add' , isAuthenticated , getPostForm);

postRoutes.post('/add' , isAuthenticated , upload.array("images" , 5 /*5 for maximum number of uploads */) , createPost);

postRoutes.get('/' , isAuthenticated , getPosts);

postRoutes.get('/:id' , isAuthenticated , getPostById);

postRoutes.get('/:id/edit' , isAuthenticated , getEditPostForm);

postRoutes.post('/edit/:id' , isAuthenticated , upload.array("images" , 5) , updatePost);

postRoutes.get('/:id/delete' , isAuthenticated , deletePost);

module.exports = postRoutes;