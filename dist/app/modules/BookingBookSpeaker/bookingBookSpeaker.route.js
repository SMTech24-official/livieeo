"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingBookSpeakerRoutes = void 0;
const express_1 = require("express");
const bookingBookSpeaker_controller_1 = require("./bookingBookSpeaker.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(client_1.UserRole.USER), bookingBookSpeaker_controller_1.BookingBookSpeakerControllers.createBookingBookSpeaker);
router.get('/engagement-history', (0, auth_1.default)(client_1.UserRole.USER), bookingBookSpeaker_controller_1.BookingBookSpeakerControllers.getAllBookingBookSpeakers);
exports.BookingBookSpeakerRoutes = router;
//# sourceMappingURL=bookingBookSpeaker.route.js.map