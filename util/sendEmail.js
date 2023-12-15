// emailService.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const message = {
    from: "noreply@lekkssservice.com",
    to,
    subject,
    html,
  };

  // Send Email
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export { sendEmail };
