// utils/cloudinary.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto', // ✅ Support both images and videos
  });
};

module.exports = {
  cloudinary, // ✅ This is cloudinary.v2
  uploadToCloudinary,
};
