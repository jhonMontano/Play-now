import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const loginUser = async ({ correo, password }) => {
  const user = await User.findOne({ where: { correo } });
  if (!user) throw new Error("Correo no registrado");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    {
      id: user.id,
      correo: user.correo,
      idRol: user.idRol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { token, user };
};

export const logoutUser = async (token) => {
  if (!token) throw new Error("Token no proporcionado");
  await addTokenToBlacklist(token);
};