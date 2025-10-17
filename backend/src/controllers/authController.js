import { loginUser } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const { token, user } = await loginUser({ correo, password });

    res.json({
      message: "Successful login",
      token,
      user: {
        id: user.id,
        correo: user.correo,
        numeroDocumento: user.numeroDocumento,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
