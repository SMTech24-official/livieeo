import { Router } from "express";
import { BookingBookSpeakerControllers } from "./bookingBookSpeaker.controller";

const router = Router()

router.post('/create', BookingBookSpeakerControllers.createBookingBookSpeaker)



export const BookingBookSpeakerRoutes = router