import { Contact } from "@prisma/client"
import prisma from "../../../shared/prisma"
import { JwtPayload } from "jsonwebtoken"
import { EmailSender } from "../../../helpers/emailSender"
import emailSender from "../Auth/emailSender"

const saveContactIntoDB = async (payload: Contact, user: JwtPayload) => {

    payload.firstName = user.firstName
    payload.lastName = user.lastName
    payload.email = user.email
    const result = await prisma.contact.create({ data: payload })


    await emailSender(
        user.email,
        "Contact Form Submission",
        `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${user.firstName} ${user.lastName}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${payload.phoneNumber || "N/A"}</p>
        <p><b>Message:</b> ${payload.message}</p>
      `
    );



    return result
}

export const ContactServices = {
    saveContactIntoDB
}