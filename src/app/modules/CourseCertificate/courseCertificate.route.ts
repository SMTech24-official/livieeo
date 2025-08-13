import { Router } from "express";
import { CourseCertificateControllers } from "./courseCertificate.controller";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { fileUploader } from "../../../helpers/fileUploader";

const router = Router();

router.post("/create",fileUploader.upload.single("file"),textToJSONParser, CourseCertificateControllers.createCourseCertificate)

export const CourseCertificateRoutes = router;