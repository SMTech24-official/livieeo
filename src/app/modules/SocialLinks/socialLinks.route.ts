import { Router } from "express";
import { SocialLinksControllers } from "./socialLinks.controller";

const router = Router()

router.post("/create", SocialLinksControllers.createSocialLinks);
router.patch("/:id", SocialLinksControllers.updateSocialLinks);
router.delete("/:id", SocialLinksControllers.deleteSocialLinks);
router.get("/:id", SocialLinksControllers.getSocialLinkById);
router.get("/", SocialLinksControllers.getSocialLinks);

export const SocialLinksRoutes = router;