import { Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/register", fileUploader.upload.single("file"),textToJSONParser, UserController.registerUser)
router.post("/verify-email/:userId", UserController.verifyEmail)
router.post("/create-admin", fileUploader.upload.single("file"),textToJSONParser, UserController.createAdmin)
router.get("/", UserController.getAllUser)
router.get("/customers", UserController.getAllCustomer)
router.get("/my-info",auth(UserRole.USER), UserController.getCustomerById)
router.put("/update-profile", fileUploader.upload.single("file"),textToJSONParser, UserController.updateProfile)
router.patch("/update-role/:id", UserController.updateUserRole)
router.patch("/edit/admin-setting/:id", UserController.editAdminSetting)

export const UserRoutes = router;