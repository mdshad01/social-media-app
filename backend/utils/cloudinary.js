import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2 minutes
});

export const uploadToCloudinary = async (fileUrl) => {
  try {
    const response = await cloudinary.v2.uploader.upload(fileUrl);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// ✅ NEW FUNCTION - Upload video using stream (faster, no timeout)
export const uploadVideoToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "posts/videos",
        chunk_size: 6000000,
        timeout: 300000, // 5 minutes
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};
