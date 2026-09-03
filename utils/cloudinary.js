
// server/src/utils/cloudinary.js
const cloudinary  = require('cloudinary').v2;
const dotenv = require("dotenv")

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (fileBuffer, folder = 'AEEY') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    stream.end(fileBuffer);
  });
};

module.exports = {cloudinary, uploadToCloudinary}