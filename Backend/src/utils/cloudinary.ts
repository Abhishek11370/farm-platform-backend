import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = !!(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  logger.info("Cloudinary configured successfully.");
} else {
  logger.warn(
    "Cloudinary not configured. Image uploads will return placeholder fallback URLs.",
  );
}

/**
 * Uploads a file (base64 string or file path) to Cloudinary.
 * If Cloudinary is not configured, returns a mock local/unauthenticated placeholder image path.
 */
export const uploadImage = async (
  fileStr: string,
  folder = "farm-platform",
): Promise<string> => {
  if (!isConfigured) {
    logger.debug(
      "Cloudinary not configured, returning mock placeholder image.",
    );
    return `https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=60`;
  }
  try {
    const res = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    logger.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};
