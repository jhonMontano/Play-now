import User from "../models/user.js";

export const registerUser = async (data) => {
  const { tipoDocumento, numeroDocumento, correo } = data;

  const existingUser = await User.findOne({ where: { numeroDocumento } });
  if (existingUser) throw new Error("El documento ya esta registrado");

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

  await user.update(data);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.destroy();
  return { message: "Usuario eliminado exitosamente"};
};