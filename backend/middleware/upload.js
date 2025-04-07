// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinary'); // ✅ Destructure the v2 instance correctly

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // ✅ Must be the cloudinary.v2 instance
  params: {
    folder: 'instagram_stories', // Use the correct folder for stories
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'], // ✅ Add mp4 for story videos
    resource_type: 'auto', // ✅ So both image & video uploads work
  },
});

console.log("Cloudinary defined?", cloudinary !== undefined); // should be true


const upload = multer({ storage });

module.exports = upload;
