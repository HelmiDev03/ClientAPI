const cloudinary = require('./cloudinaryconfig');
const opts = require('./cloudinaryconfig');

  
  const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
        
          return resolve(result.secure_url);
        }
        
        return reject({ image: error.message });
      });
    });
  };


  module.exports  = uploadImage;