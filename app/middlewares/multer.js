const multer = require('multer');
const path = require('path');

const storageAirlines = path.join(__dirname, '../../public');
// const storageRecipe = path.join(__dirname, "../../public");
// const storageVideo = path.join(__dirname, "../../public");

const AirlineStorage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, storageAirlines);
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + '-' + file.originalname);
  }
});

const fileFilterImages = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    console.log('Only extension png, jpg and jpeg are supported');
  }
};

exports.UploadAirlines = multer({
  storage: AirlineStorage,
  fileFilter: fileFilterImages,
  limits: { fileSize: 1 * 1024 * 1024 }
}).single('airline_logo');

exports.UploadProfile = multer({
  storage: AirlineStorage,
  fileFilter: fileFilterImages,
  limits: { fileSize: 1 * 1024 * 1024 }
}).single('profilePicture');
