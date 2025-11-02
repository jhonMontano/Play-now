import User from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


export const registerUser = async (data) => {
  const { tipoDocumento, numeroDocumento, correo } = data;

  const existingUser = await User.findOne({ where: { numeroDocumento } });
  if (existingUser) throw new Error("El documento ya esta registrado");

  const existingEmail = await User.findOne({ where: { correo } });
  if (existingEmail) throw new Error("El correo ya se encuentra registrado");

  return await User.create({
    ...data,
    password: numeroDocumento, 
  });
};

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

export const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.update(data);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.destroy();
  return { message: "Usuario eliminado exitosamente"};
};


export const sendPasswordResetEmail = async (email) => {
  const user = await User.findOne({ where: { correo: email } });
  if (!user) throw new Error("Usuario no encontrado");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const resetLink = `http://localhost:8080/users/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    
html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 500px; margin: auto;">
  <h2 style="color: #333;">Hola 👋</h2>
  
  <p style="font-size: 16px; color: #555; line-height: 1.5;">
    Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar.
  </p>
  
  <a href="${resetLink}" 
     style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
    Restablecer contraseña
  </a>
  
  <p style="font-size: 14px; color: #777; margin-top: 20px; line-height: 1.5;">
    Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este mensaje.
  </p>
</div>
`,
  };

  await transporter.sendMail(mailOptions);
};

export const confirmPasswordReset = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error("Usuario no encontrado");

    await user.update({ password: newPassword });
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};