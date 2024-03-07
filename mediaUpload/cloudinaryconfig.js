const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
    maxFileSize: 1048576, // Sets the maximum allowed file size for uploads (1 MB in bytes)
  };



  module.exports  = cloudinary;
  module.exports.opts = opts;