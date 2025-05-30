const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.js');

const storage = new CloudinaryStorage({
    cloudinary ,
    params : {
        folder : "Blog-Project" ,
        allowed_formats : [ "jpg" , "png" ]
    } ,
});

const upload = multer({ storage });
module.exports = upload;