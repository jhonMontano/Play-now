import jwt from "jsonwebtoken";
import { addTokenToBlacklist } from "../models/tokenBlacklist.js";
import { loginUser } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const { token, user } = await loginUser({ correo, password });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        correo: user.correo,
        numeroDocumento: user.numeroDocumento,
        idRol: user.idRol,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  addTokenToBlacklist(token);
  res.json({ message: "Sesión cerrada correctamente" });
};
