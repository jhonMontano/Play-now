import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../utils/emailTemplats.js";
import { createTransporter } from "../utils/mailer.js";

export const registerUser = async (data) => {
  const { tipoDocumento, numeroDocumento, correo } = data;

  const existingUser = await User.findOne({ where: { numeroDocumento } });
  if (existingUser) throw new Error("El documento ya está registrado");

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

  if (data.hasOwnProperty("activo") && user.idMall) {
    throw new Error("No se puede modificar el estado 'activo' de un usuario con centro comercial asignado.");
  }

  await user.update(data);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.destroy();
  return { message: "Usuario eliminado exitosamente" };
};

export const sendPasswordResetEmail = async (email) => {
  const user = await User.findOne({ where: { correo: email } });
  if (!user) throw new Error("Usuario no encontrado");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const resetLink = `${process.env.FRONTEND_URL}/users/reset-password/${token}`;

  const transporter = createTransporter(); 
  const mailOptions = sendResetPasswordEmail(email, resetLink);

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
