import { Router } from "express";
import { ContactControllers } from "./contact.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", ContactControllers.saveContact);

export const ContactRoutes = router;
