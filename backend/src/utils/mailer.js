/*import nodemailer from "nodemailer";

export const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'admonplaynow@gmail.com', //process.env.EMAIL_USER,
      pass: 'haygsyqysncjylgt', //process.env.EMAIL_PASS,
    },
  });

  transporter.verify().then(() => {
    console.log("SMTP OK: transporter listo para enviar correos");
  }).catch((error) => {
    console.error("SMTP ERROR: no se pudo verificar el transporte", error);
  });

  return transporter;
};*/

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("Correo enviado:", response);

    return response;

  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};