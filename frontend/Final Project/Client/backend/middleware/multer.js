//multer.js
import multer from 'multer';

// Configure memory storage to work with Cloudinary
const storage = multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload = multer({storage})

export default upload;
