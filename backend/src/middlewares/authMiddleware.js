import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../models/tokenBlacklist.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 👇 CORRECCIÓN: Mapear los campos correctamente
    req.user = {
      id: decoded.id,
      correo: decoded.correo,
      idRol: decoded.idRol,
      idMall: decoded.mallId || decoded.idMall // ← Maneja ambos casos
    };
    
    console.log('🔐 User autenticado:', req.user); // ← Debug
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
