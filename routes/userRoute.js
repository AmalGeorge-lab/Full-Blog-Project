const express = require('express');
const userRoute = express.Router();
const { getUserProfile , getEditProfileForm , updateProfile , deleteUser } = require('../controllers/userController.js');
const { isAuthenticated } = require('../config/token.js');
const upload = require('../config/multer.js');



userRoute.get('/profile' , isAuthenticated , getUserProfile);

userRoute.get('/edit' , isAuthenticated , getEditProfileForm);

userRoute.post('/profileUpdate' , isAuthenticated , upload.single("image") , updateProfile);

userRoute.get('/delete' , isAuthenticated , deleteUser);


module.exports = userRoute;