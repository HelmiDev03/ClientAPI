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
  };



  module.exports  = cloudinary;
  module.exports.opts = opts;