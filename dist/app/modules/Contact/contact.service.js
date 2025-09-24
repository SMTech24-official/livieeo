"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const emailSender_1 = __importDefault(require("../Auth/emailSender"));
const saveContactIntoDB = async (payload) => {
    const result = await prisma_1.default.contact.create({ data: payload });
    await (0, emailSender_1.default)(payload.email, "Contact Form Submission", `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin:0; padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="20" cellspacing="0" style="background:#ffffff; border:1px solid #e0e0e0; border-radius:6px;">
          <tr>
            <td align="center">
              <h2 style="color:#333; margin:0;">Thanks for contacting us!</h2>
              <p style="color:#555; margin:10px 0 0;">We will reach out to you shortly.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`);
    return result;
};
exports.ContactServices = {
    saveContactIntoDB,
};
//# sourceMappingURL=contact.service.js.map