import { Router } from "express";
import { EducationControllers } from "./education.controller";

const router = Router()

router.post("/create", EducationControllers.createEducation);
router.patch("/:id", EducationControllers.updateEducation);
router.delete("/:id", EducationControllers.deleteEducation);
router.get("/:id", EducationControllers.getEducationById);
router.get("/", EducationControllers.getEducations);

export const EducationRoutes = router;