import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const loginUser = async ({ correo, password }) => {
  const user = await User.findOne({ where: { correo } });
  if (!user) throw new Error("Correo no registrado");

  if (user.bloqueadoHasta && user.bloqueadoHasta > new Date()) {
    const minutosRestantes = Math.ceil((user.bloqueadoHasta - new Date()) / 60000);
    throw new Error(`Usuario bloqueado. Intenta de nuevo en ${minutosRestantes} minutos.`);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    user.intentosFallidos += 1;

    if (user.intentosFallidos >= 3) {
      const minutosBloqueo = 10;
      user.bloqueadoHasta = new Date(Date.now() + minutosBloqueo * 60000);
      await user.save();
      throw new Error(`Usuario bloqueado por ${minutosBloqueo} minutos. Debe recuperar la contraseña.`);
    }

    await user.save();
    throw new Error("Contraseña incorrecta");
  }

  user.intentosFallidos = 0;
  user.bloqueadoHasta = null;
  await user.save();

  const token = jwt.sign(
    {
      id: user.id,
      correo: user.correo,
      idRol: user.idRol,
      mallId: user.idMall
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

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error("Usuario no encontrado");

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new Error("La contraseña actual es incorrecta");

  if (currentPassword === newPassword) {
    throw new Error("La nueva contraseña no puede ser igual a la actual");
  }

  user.password = newPassword;
  user.intentosFallidos = 0;
  user.bloqueadoHasta = null;

  await user.save();

  return true;
};

