import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Upload an image
export const uploadStreamOnCloudinary = async (buffer: Uint8Array) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const result = await new Promise<UploadApiResponse | undefined>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(buffer);
    }
  );
  return result;
};
// export const uploadFileOnCloudinary = async (file: File) => {
//   // Configuration
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
//   const url = URL.createObjectURL(file);
//   const result = await cloudinary.uploader.upload(url).catch((error) => {
//     console.log(error);
//   });
//   console.log(result);
//   return result;
// };
// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//   crop: "auto",
//   gravity: "auto",
//   width: 500,
//   height: 500,
// });

// console.log(autoCropUrl);
