import multer from "multer";
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: max 5MB
});

async function uploadFileToCloud(filePath) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "APNA_VAKIL",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"],
    });
    console.log("Uploaded to Cloudinary:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

async function deleteImageByPublicId(publicId) {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    console.log("Deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw error;
  }
}

async function deleteImageByUrl(imageUrl) {
    try {
        if (!imageUrl) throw new Error("Image URL is required");

        let match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
        if (!match || !match[1]) throw new Error("Invalid Cloudinary URL format");

        let publicId = match[1];  
        let result = await cloudinary.uploader.destroy(publicId);

        return result;
    } catch (error) {
        console.error("Error deleting Cloudinary image:", error);
        throw error;
    }
}

export { uploadFile, uploadFileToCloud, deleteImageByPublicId , deleteImageByUrl };
