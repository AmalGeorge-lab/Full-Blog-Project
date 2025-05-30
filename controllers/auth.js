const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/token.js');

exports.getLogin = (request,response)=>{
    response.render('login' , { title : "Login" , user : request.user , error : '' });
}

exports.login = async(request,response)=>{
    const { email , password } = request.body;
    const userFound = await User.findOne({ email });
    if(userFound && await bcrypt.compare( password , userFound.password )){
        const token = generateToken(userFound);
        response.cookie('token' , token , {
            maxAge : 60 * 60 * 1000 ,
            httpOnly : true ,
        });
        response.render('home' , { title : "Dashboard" , user : userFound });
    }else{
        response.render('login' , { title : "Login" , user : request.user , error : "Invalid credentials" });
    }
}

exports.getRegister = (request,response)=>{
    response.render('register' , { title : 'Register' , user : request.user , error : '' });
}

exports.register = async(request,response)=>{
    const { username , email , password } = request.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return response.render('register',{ title : 'Register' , user : request.user , error : 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        await User.create({
            username , 
            email ,
            password : hashedPassword
        });
        response.redirect('/auth/login');
    } catch (error) {
        response.render('register', { title : 'Register' , user : request.user , error : error.message });
    }
}

exports.dashboard = (request,response)=>{
    console.log(request.user);
    response.render("home" , { title : "Dashboard" , user : request.user , error : '' });
}

exports.logout = (request,response)=>{
    response.clearCookie('token');
    response.redirect('/auth/login');
}