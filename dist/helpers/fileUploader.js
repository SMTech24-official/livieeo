"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises"); // async unlink
const fs_1 = __importStar(require("fs"));
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
            await (0, promises_1.unlink)(filePath);
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
const uploadPdfBuffer = async (buffer, publicId) => {
    // Ensure uploads folder exists
    const uploadDir = path_1.default.join(process.cwd(), "uploads");
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir);
    }
    // Generate file name
    const filename = `${publicId || Date.now()}.pdf`;
    const filePath = path_1.default.join(uploadDir, filename);
    // Write buffer to disk
    await fs_1.default.promises.writeFile(filePath, buffer);
    // Return relative URL (served by Express)
    return { url: `/uploads/${filename}`, path: filePath };
};
exports.fileUploader = {
    upload,
    uploadToCloudinary,
    uploadVideoToCloudinary,
    uploadMultipleToCloudinary,
    uploadMultipleVideoToCloudinary,
    uploadPdfBuffer,
};
//# sourceMappingURL=fileUploader.js.map