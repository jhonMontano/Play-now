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

import nodemailer from "nodemailer";

export const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "admonplaynow@gmail.com",
      pass: "haygsyqysncjylgt",
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  transporter.verify()
    .then(() => {
      console.log("SMTP OK");
    })
    .catch((error) => {
      console.error("SMTP ERROR", error);
    });

  return transporter;
};