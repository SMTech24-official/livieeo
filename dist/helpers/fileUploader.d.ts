import multer from "multer";
import { ICloudinaryResponse, IFile } from "../interfaces/file";
export declare const fileUploader: {
    upload: multer.Multer;
    uploadToCloudinary: (file: IFile) => Promise<ICloudinaryResponse | undefined>;
    uploadVideoToCloudinary: (file: IFile) => Promise<ICloudinaryResponse | undefined>;
    uploadMultipleToCloudinary: (files: IFile[]) => Promise<ICloudinaryResponse[]>;
    uploadMultipleVideoToCloudinary: (files: IFile[]) => Promise<ICloudinaryResponse[]>;
    uploadPdfBuffer: (buffer: Buffer, publicId?: string) => Promise<unknown>;
};
//# sourceMappingURL=fileUploader.d.ts.map