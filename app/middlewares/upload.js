const multer = require("multer");
const multerUtils = require("../multer");

const uploadSingle = (req, res, next) => {
  const uploadSingle = multerUtils.single("image");

  uploadSingle(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).send(err?.message ?? "Something went wrong!");
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(400).send(err ?? "Something went wrong!");
        return;
      }

      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload Failed");
    }
  });
};

const uploadProfile = (req, res, next) => {
  const uploadSingle = multerUtils.single("profile");

  uploadSingle(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).send(err?.message ?? "Something went wrong!");
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(400).send(err ?? "Something went wrong!");
        return;
      }
      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload Failed");
    }
  });
};

const uploadAirlines = (req, res, next) => {
  const uploadSingle = multerUtils.single("airlines");

  uploadSingle(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).send(err?.message ?? "Something went wrong!");
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(400).send(err ?? "Something went wrong!");
        return;
      }
      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload Failed");
    }
  });
};

module.exports = {
  uploadSingle,
  uploadProfile,
  uploadAirlines,
};
