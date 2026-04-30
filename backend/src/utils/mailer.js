import nodemailer from "nodemailer";

export const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify().then(() => {
    console.log("SMTP OK: transporter listo para enviar correos");
  }).catch((error) => {
    console.error("SMTP ERROR: no se pudo verificar el transporte", error);
  });

  return transporter;
};