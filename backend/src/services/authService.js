import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const loginUser = async ({ correo, password }) => {
  const user = await User.findOne({ where: { correo } });
  if (!user) throw new Error("Email do not registered");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Incorrect password");

  const token = jwt.sign(
    { id: user.id, correo: user.correo },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { token, user };
};