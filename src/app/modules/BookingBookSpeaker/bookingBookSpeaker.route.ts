import { Router } from "express";
import { BookingBookSpeakerControllers } from "./bookingBookSpeaker.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post('/create',auth(UserRole.USER), BookingBookSpeakerControllers.createBookingBookSpeaker)
router.get('/engagement-history',auth(UserRole.USER), BookingBookSpeakerControllers.getAllBookingBookSpeakers)

export const BookingBookSpeakerRoutes = router