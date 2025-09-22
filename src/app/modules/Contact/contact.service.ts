import { Contact } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import { EmailSender } from "../../../helpers/emailSender";
import emailSender from "../Auth/emailSender";

const saveContactIntoDB = async (payload: Contact) => {
  const result = await prisma.contact.create({ data: payload });

  //   await emailSender(
  //     payload.email,
  //     "Contact Form Submission",
  //     `
  //         <h2>New Contact Form Submission</h2>
  //         <p><b>Name:</b> ${payload.firstName} ${payload.lastName}</p>
  //         <p><b>Email:</b> ${payload.email}</p>
  //         <p><b>Phone:</b> ${payload.phoneNumber || "N/A"}</p>
  //         <p><b>Message:</b> ${payload.message}</p>
  //       `
  //   );

  return result;
};

export const ContactServices = {
  saveContactIntoDB,
};
