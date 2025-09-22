import multer from "multer";
import path from "path";
import { unlink } from "fs/promises"; // async unlink
import fs, { existsSync } from "fs";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import { ICloudinaryResponse, IFile } from "../interfaces/file";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name as string,
  api_key: config.cloudinary_api_key as string,
  api_secret: config.cloudinary_api_secret as string,
});

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // better unique filename
  },
});

const upload = multer({ storage: storage });

// Safe unlink function
const safeUnlink = async (filePath: string) => {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    } else {
      console.warn(`File not found, skipping unlink: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to unlink file: ${filePath}`, err);
  }
};

// Upload image/file to Cloudinary
const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, async (error: any, result: any) => {
      await safeUnlink(file.path);
      if (error) reject(error);
      else resolve(result as ICloudinaryResponse);
    });
  });
};

// Upload multiple images to Cloudinary
const uploadMultipleToCloudinary = async (
  files: IFile[]
): Promise<ICloudinaryResponse[]> => {
  const results: ICloudinaryResponse[] = [];

  for (const file of files) {
    const res = await uploadToCloudinary(file);
    if (res) results.push(res);
  }

  return results;
};
// Upload multiple video to Cloudinary
const uploadMultipleVideoToCloudinary = async (
  files: IFile[]
): Promise<ICloudinaryResponse[]> => {
  const results: ICloudinaryResponse[] = [];

  for (const file of files) {
    const res = await uploadVideoToCloudinary(file);
    if (res) results.push(res);
  }

  return results;
};

// Upload video to Cloudinary
const uploadVideoToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { resource_type: "video" },
      async (error: any, result: any) => {
        await safeUnlink(file.path);
        if (error) reject(error);
        else resolve(result as ICloudinaryResponse);
      }
    );
  });
};
// const uploadPdfBuffer = (buffer: Buffer, publicId?: string) =>
//   new Promise((resolve, reject) => {
//     const options: Record<string, any> = {
//       folder: "certificates",
//       resource_type: "raw", // PDF = raw
//       format: "pdf",
//     };
//     if (publicId !== undefined) {
//       options.public_id = publicId;
//     }
//     const stream = cloudinary.uploader.upload_stream(options, (err, result) =>
//       err ? reject(err) : resolve(result)
//     );
//     stream.end(buffer);
//   });

const uploadPdfBuffer = async (buffer: Buffer, publicId?: string) => {
  // Ensure uploads folder exists
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Generate file name
  const filename = `${publicId || Date.now()}.pdf`;
  const filePath = path.join(uploadDir, filename);

  // Write buffer to disk
  await fs.promises.writeFile(filePath, buffer);

  // Return relative URL (served by Express)
  return { url: `/uploads/${filename}`, path: filePath };
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
  uploadVideoToCloudinary,
  uploadMultipleToCloudinary,
  uploadMultipleVideoToCloudinary,
  uploadPdfBuffer,
};
