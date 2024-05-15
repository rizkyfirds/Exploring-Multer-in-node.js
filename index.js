const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const app = express();

//single file upload
// const upload = multer({dest: "uploads/"})
// app.post('/upload', upload.single("file"), (req,res) => {
//     res.json({statuss: 'success'});
// })

//MULTIPLE file upload
// const upload = multer({dest: "uploads/"})
// app.post('/upload', upload.array("file"), (req,res) => {
//     res.json({statuss: 'success'});
// })

//MULTIPLE file upload with max file statement "2" for 2 files per statement
// const upload = multer({dest: "uploads/"})
// app.post('/upload', upload.array("file", 2), (req,res) => {
//     res.json({statuss: 'success'});
// })

//multiple fields upload
// const upload = multer({ dest: "uploads/" });
// const multiUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "resume", maxCount: 1 },
// ]);
// app.post("/upload", multiUpload, (req, res) => {
//   console.log(req.files) //for describe from files we get
//     res.json({ statuss: "success" });
// });

// custom file name
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb) =>{
        const {originalname} = file;
        cb(null, `${uuid()}-${originalname}`);
    }
});
//the name i wanna like uuid-originName. customize the name file using uuid library

// filter type file name
const fileFilter = (req, file, cb) =>{
    if (file.mimetype.split('/')[0] === 'image'){
        cb(null, true)
    }   else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}
// mimetype.split('/') from 'image/jpeg' = ['image', 'jpeg]

// limits for limitation of file 
const upload = multer({storage, fileFilter, limits: {fileSize: 1000000, files: 2}})
app.post('/upload', upload.array("file"), (req,res) => {
    res.json({statuss: 'success'});
})

//using this for error conditions so the massage can be customized
app.use((error, req, res, next) => {
    if(error instanceof multer.MulterError){
        if(error.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({message:"File size exceeds limit"})
        }
    }

    if(error instanceof multer.MulterError){
        if(error.code === 'LIMIT_FILE_COUNT'){
            return res.status(400).json({message:"File exceeds limit"})
        }
    }

    if(error instanceof multer.MulterError){
        if(error.code === 'LIMIT_UNEXPECTED_FILE'){
            return res.status(400).json({message:"File must be an image"})
        }
    }
})

app.listen(4000, () => console.log("listening on port 4000"));
