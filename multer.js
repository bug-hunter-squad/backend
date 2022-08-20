const multer = require('multer');
const path = require('path');
const cloudinaryStorage = require('cloudinary-multer');
// const uploadimage = require("./middleware/upload");
const cloudinary = require('../backend/app/middlewares/couldinary');

//
const storage = cloudinaryStorage({
  cloudinary
});


const upload = multer({
  storage,
  limits: {
    fileSize: 1000000 // 1MB
  },
  fileFilter
});

function fileFilter (req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;

  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
}

module.exports = upload;
