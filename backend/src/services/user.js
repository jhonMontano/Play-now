import User from "../models/user.js";

export const registerUser = async (data) => {
  const { tipoDocumento, numeroDocumento, correo } = data;

  const existingUser = await User.findOne({ where: { numeroDocumento } });
  if (existingUser) throw new Error("The document is already registered");

  const existingEmail = await User.findOne({ where: { correo } });
  if (existingEmail) throw new Error("The email is already registered");

  return await User.create(data);
};

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.update(data);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return { message: "Successfully deleted user"};
};