const multer=require('multer')

module.exports=multer({
     Storage:multer.diskStorage({}),
        destination:"./public/uploads/",
        filename:(req,file,cb)=>{
          var name = file.fieldname+"_"+Date.now()+path.extname(file.originalname);
          req.body.Imagename = "http://localhost:4000/uploads/"+name;
          cb(null,name);
        }
})