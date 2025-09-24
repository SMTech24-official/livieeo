import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: `"Livieeo" <${config.emailSender.email}>`,
    to: email,
    subject: subject,
    html,
  });
  return info;
};
export default emailSender;
