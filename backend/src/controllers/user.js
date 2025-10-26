import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "../services/user.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Usuario registrado exitosamente", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    const response = await deleteUser(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email);
    res.status(200).json({ message: "Correo de recuperación enviado." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const resetPasswordConfirm = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await confirmPasswordReset(token, newPassword);
    res.status(200).json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
