"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const logger_1 = require("./logger");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const isConfigured = !!(cloudName && apiKey && apiSecret);
if (isConfigured) {
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });
    logger_1.logger.info('Cloudinary configured successfully.');
}
else {
    logger_1.logger.warn('Cloudinary not configured. Image uploads will return placeholder fallback URLs.');
}
/**
 * Uploads a file (base64 string or file path) to Cloudinary.
 * If Cloudinary is not configured, returns a mock local/unauthenticated placeholder image path.
 */
const uploadImage = async (fileStr, folder = 'farm-platform') => {
    if (!isConfigured) {
        logger_1.logger.debug('Cloudinary not configured, returning mock placeholder image.');
        return `https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=60`;
    }
    try {
        const res = await cloudinary_1.v2.uploader.upload(fileStr, {
            folder,
            resource_type: 'auto'
        });
        return res.secure_url;
    }
    catch (error) {
        logger_1.logger.error('Error uploading image to Cloudinary:', error);
        throw new Error('Image upload failed');
    }
};
exports.uploadImage = uploadImage;
