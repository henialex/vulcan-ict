const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/projects");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// File filter (allowed types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = allowedTypes.test(ext);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png, webp) are allowed"));
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;