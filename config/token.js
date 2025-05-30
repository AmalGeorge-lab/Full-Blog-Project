require('dotenv').config();
const jwt = require('jsonwebtoken');


const generateToken = (userDetails)=>{
    const token = jwt.sign({
        username : userDetails.username ,
        _id : userDetails._id
    } , process.env.MY_KEY , { 
        expiresIn :  '1d'
    });
    return token;
}

const isAuthenticated = (request,response,next)=>{
    const token = request.cookies ? request.cookies.token : null;
    if(!token){
        return response.redirect('/auth/login');
    }
    jwt.verify(token , process.env.MY_KEY , (err , decoded)=>{
        if (err) return response.redirect('/auth/login');
        request.user = decoded;
        next();
    });
}

module.exports = { generateToken , isAuthenticated };