import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../models/tokenBlacklist.js";
import User from "../models/user.js";

export const authenticateToken = async (req, res, next) => {

  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token no proporcionado"
    });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({
      message: "Token inválido o expirado"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    req.user = user;

    console.log(
      "USER COMPLETO:",
      JSON.stringify(req.user, null, 2)
    );

    next();

  } catch (error) {

    console.error("ERROR AUTH:", error);

    return res.status(401).json({
      message: "Token inválido o expirado"
    });
  }
};