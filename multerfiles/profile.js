// const multer = require('multer');

// const path = require('path'); 

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/profile'); 
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, Date.now() + ext); 
//     }
// });
// const fs = require("fs");
// if (!fs.existsSync("./uploads/profile")) {
//   fs.mkdirSync("./uploads/profile", { recursive: true });
// }

// const upload = multer({ storage: storage });

// module.exports = upload; 
