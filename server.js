require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/auth');
const postRoute = require('./routes/postRoute.js');
const commentRoute = require('./routes/commentRoute.js');
const userRoute = require('./routes/userRoute.js');
const cookieParser = require('cookie-parser');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT;


app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'middlewares')));
app.use(cookieParser());
app.set("view engine" , "ejs");
app.use(ejsLayouts);
app.set( "layout" , "layout/main-layout" );
app.use('/auth' , router);
app.use('/posts' , postRoute);
app.use('/' , commentRoute);
app.use('/user' , userRoute);


app.get('/' , (request,response)=>{
    response.render("home" , { title : "Home" , user : request.user });
});



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('DB connected');
    app.listen(port , console.log(`Server running on port ${port}...`));
}).catch((error)=>{
    console.log(error.message);
});