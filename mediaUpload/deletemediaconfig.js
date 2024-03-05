
const cloudinary = require('./cloudinaryconfig');


  

 const deleteImage = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (result && result.result === 'ok') {
              
                resolve(result);
            } else {
               
                reject(error);
            }
        });
    });
};

module.exports  = deleteImage;
