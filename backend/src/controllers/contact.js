import { sendContactFormEmail } from "../services/contact.js";

export const submitContactForm = async (req, res) => {
  const { nombre, email, tipo, mensaje } = req.body;

  if (!nombre || !email || !tipo || !mensaje) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await sendContactFormEmail({ nombre, email, tipo, mensaje });
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error al enviar el mensaje" });
  }
};
