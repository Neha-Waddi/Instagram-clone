// backend/utils/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reels/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100000000 // 100MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|mov|avi|wmv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Videos only!');
  }
});


module.exports = 
{
  imageUpload:multer({ storage, fileFilter }),
  videoUpload: videoUpload
}
