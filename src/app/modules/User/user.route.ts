import { Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/register", fileUploader.upload.single("file"),textToJSONParser, UserController.registerUser)
router.post("/verify-email/:userId", UserController.verifyEmail)
router.post("/create-admin",auth(UserRole.ADMIN), fileUploader.upload.single("file"),textToJSONParser, UserController.createAdmin)
router.get("/",auth(UserRole.USER,UserRole.ADMIN), UserController.getAllUser)
router.get("/customers",auth(UserRole.ADMIN), UserController.getAllCustomer)
router.get("/my-info",auth(UserRole.USER,UserRole.ADMIN), UserController.getCustomerById)
router.put("/update-profile",auth(UserRole.USER,UserRole.ADMIN), fileUploader.upload.single("file"),textToJSONParser, UserController.updateProfile)
router.patch("/update-role/:id",auth(UserRole.ADMIN), UserController.updateUserRole)
router.patch("/edit/admin-setting/:id",auth(UserRole.ADMIN), UserController.editAdminSetting)

export const UserRoutes = router;