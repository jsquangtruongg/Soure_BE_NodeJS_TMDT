import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("Cloudinary Config:");
console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_KEY);
console.log("CLOUDINARY_SECRET:", process.env.CLOUDINARY_SECRET);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "TMDT_Nodejs",
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
