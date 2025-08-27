import { Router } from "express";
import { CourseCertificateControllers } from "./courseCertificate.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// সার্টিফিকেট ইস্যু (শুধু যাদের কোর্স পেইড আছে তাদের)
router.post("/issue", auth(UserRole.USER, UserRole.ADMIN), CourseCertificateControllers.createCourseCertificate);

// সার্টিফিকেট ভেরিফিকেশন (পাবলিক লিংক)
router.get("/verify/:code", CourseCertificateControllers.verifyCourseCertificate);
// ইউজারের নিজের সার্টিফিকেট লিস্ট
router.get("/my-certificates", auth(UserRole.USER, UserRole.ADMIN), CourseCertificateControllers.getMyCertificates);

export const CourseCertificateRoutes = router; 