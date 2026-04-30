import { createTransporter } from "../utils/mailer.js";
import { sendContactFormEmailTemplate } from "../utils/emailContact.js";

export const sendContactFormEmail = async ({ nombre, email, tipo, mensaje }) => {
  const transporter = createTransporter();
  const mailOptions = sendContactFormEmailTemplate({ nombre, email, tipo, mensaje });

  try {
    await transporter.verify();
  } catch (error) {
    throw new Error(`Error de conexión SMTP: ${error.message}`);
  }

  console.log("Enviando correo de contacto a:", mailOptions.to);
  await transporter.sendMail(mailOptions);
};
