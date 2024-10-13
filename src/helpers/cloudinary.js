const {config,uploader}= require('cloudinary').v2;
const cloudinaryConfig = config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
module.exports = {cloudinaryConfig,uploader}