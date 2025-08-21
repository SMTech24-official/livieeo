"use strict";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";
// import config from "../config";
// import { ICloudinaryResponse, IFile } from "../interfaces/file";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
// cloudinary.config({
//     cloud_name: config.cloudinary_cloud_name as string,
//     api_key: config.cloudinary_api_key as string,
//     api_secret: config.cloudinary_api_secret as string,
// })
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(process.cwd(), "uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
// const upload = multer({ storage: storage });
// const uploadToCloudinary = async (
//     file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             file.path,
//             (error: any, result: any) => {
//                 fs.unlinkSync(file.path);
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(result as ICloudinaryResponse);
//                 }
//             }
//         );
//     });
// };
// const uploadVideoToCloudinary = async (
//     file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             file.path,
//             {resource_type: "video"},
//             (error: any, result: any) => {
//                 fs.unlinkSync(file.path);
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(result as ICloudinaryResponse);
//                 }
//             }
//         );
//     });
// };
// export const fileUploader = {
//     upload,
//     uploadToCloudinary,
//     uploadVideoToCloudinary
// };
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises")); // async unlink
const fs_1 = require("fs");
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
// Multer storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // better unique filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// Safe unlink function
const safeUnlink = async (filePath) => {
    try {
        if ((0, fs_1.existsSync)(filePath)) {
            await promises_1.default.unlink(filePath);
        }
        else {
            console.warn(`File not found, skipping unlink: ${filePath}`);
        }
    }
    catch (err) {
        console.error(`Failed to unlink file: ${filePath}`, err);
    }
};
// Upload image/file to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, async (error, result) => {
            await safeUnlink(file.path);
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
};
// Upload multiple images to Cloudinary
const uploadMultipleToCloudinary = async (files) => {
    const results = [];
    for (const file of files) {
        const res = await uploadToCloudinary(file);
        if (res)
            results.push(res);
    }
    return results;
};
// Upload multiple video to Cloudinary
const uploadMultipleVideoToCloudinary = async (files) => {
    const results = [];
    for (const file of files) {
        const res = await uploadVideoToCloudinary(file);
        if (res)
            results.push(res);
    }
    return results;
};
// Upload video to Cloudinary
const uploadVideoToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, { resource_type: "video" }, async (error, result) => {
            await safeUnlink(file.path);
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
};
exports.fileUploader = {
    upload,
    uploadToCloudinary,
    uploadVideoToCloudinary,
    uploadMultipleToCloudinary,
    uploadMultipleVideoToCloudinary
};
//# sourceMappingURL=fileUploader.js.map