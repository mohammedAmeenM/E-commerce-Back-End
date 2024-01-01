const fs=require('fs');
const path=require('path');
const multer=require('multer')
const storage=multer.diskStorage({
    destination:path.join(__dirname,'uploads'),
    filename:(req,res,cb)=>{
        cb(null,Date.now() + file.orginalName)
    }
})
const upload=multer({storage});


const cloudinary=require('cloudinary').v2
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_APL_SECRET
})