"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const emailSender_1 = __importDefault(require("../Auth/emailSender"));
const saveContactIntoDB = async (payload, user) => {
    payload.firstName = user.firstName;
    payload.lastName = user.lastName;
    payload.email = user.email;
    const result = await prisma_1.default.contact.create({ data: payload });
    await (0, emailSender_1.default)(user.email, "Contact Form Submission", `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${user.firstName} ${user.lastName}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${payload.phoneNumber || "N/A"}</p>
        <p><b>Message:</b> ${payload.message}</p>
      `);
    return result;
};
exports.ContactServices = {
    saveContactIntoDB
};
//# sourceMappingURL=contact.service.js.map