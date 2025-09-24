import { Contact } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import { EmailSender } from "../../../helpers/emailSender";
import emailSender from "../Auth/emailSender";

const saveContactIntoDB = async (payload: Contact) => {
  const result = await prisma.contact.create({ data: payload });

  await emailSender(
    payload.email,
    "Contact Form Submission",
    `<!DOCTYPE html>
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
`
  );

  return result;
};

export const ContactServices = {
  saveContactIntoDB,
};
