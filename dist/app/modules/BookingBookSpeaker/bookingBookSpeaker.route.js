"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingBookSpeakerRoutes = void 0;
const express_1 = require("express");
const bookingBookSpeaker_controller_1 = require("./bookingBookSpeaker.controller");
const router = (0, express_1.Router)();
router.post('/create', bookingBookSpeaker_controller_1.BookingBookSpeakerControllers.createBookingBookSpeaker);
exports.BookingBookSpeakerRoutes = router;
//# sourceMappingURL=bookingBookSpeaker.route.js.map