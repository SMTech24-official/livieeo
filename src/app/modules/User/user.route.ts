import { Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";

const router = Router()

router.post("/register", fileUploader.upload.single("file"),textToJSONParser, UserController.registerUser)
router.post("/create-admin", fileUploader.upload.single("file"),textToJSONParser, UserController.createAdmin)
router.get("/", UserController.getAllUser)
router.get("/customers", UserController.getAllCustomer)
router.get("/:userId", UserController.getUserById)
router.put("/update-profile", fileUploader.upload.single("file"),textToJSONParser, UserController.updateProfile)
router.patch("/update-role/:id", UserController.updateUserRole)

export const UserRoutes = router;