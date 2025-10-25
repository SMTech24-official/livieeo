import nodemailer from "nodemailer";
import config from "../../../config";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

// const emailSender = async (email: string, subject: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: config.emailSender.email,
//       pass: config.emailSender.app_pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   const info = await transporter.sendMail({
//     from: `"Livieeo" <${config.emailSender.email}>`,
//     to: email,
//     subject: subject,
//     html,
//   });
//   return info;
// };

const emailSender = async (email: string, subject: string, html: string) => {
    if (!config.emailSender.brevo_api_key) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Brevo API Key isn't provided"
        );
    }

    const endpoint = "https://api.brevo.com/v3/smtp/email";

    const payload = {
        sender: {
            name: "Livieeo",
            email: config.emailSender.email
        },
        to: [{ email }],
        subject,
        htmlContent: html,
    };

    console.log(payload)

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "api-key": config.emailSender.brevo_api_key,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            const message =
                data.message || `Brevo API error (status ${response.status})`;
            throw new Error(message);
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
    }
};

export default emailSender;
