import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

export const sendMail = asyncHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Trang Thương Mại Điện Tử 👻" <nodejs@TMDT.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line

    html: html, // html body
  });
  return info;
});

