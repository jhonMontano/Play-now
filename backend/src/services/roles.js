import Roles from "../models/roles.js";

export const createRolesService = async (data) => {
    return await Roles.create(data);
};

export const getAllRolesService = async () => {
    return await Roles.findAll();
};

export const getRolesByIdService = async (id) => {
    return await Roles.findByPk(id);
};

export const updateRolesService = async (id, data) => {
    const role = await Roles.findByPk(id);
    if (!role) returnnull;

    await role.update(data);
    return role;
};

export const deleteRolesService = async (id) => {
    const role = await Roles.findByPk(id);
    if (!role) return null;

    await role.update();
    return role;
};