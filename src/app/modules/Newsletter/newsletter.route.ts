import { Router } from "express";
import { NewsletterServices } from "./newsletter.service";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { NewsletterControllers } from "./newsletter.controller";

const router = Router()

router.post("/subscribe-newsletter", NewsletterControllers.saveContact)

export const NewsletterRoutes = router