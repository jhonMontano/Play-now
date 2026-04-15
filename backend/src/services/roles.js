import Roles from "../models/roles.js";

export const createRolesService = async (data) => {
    try {
        return await Roles.create(data);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El rol ya existe');
        }
        throw error;
    }
};

export const getAllRolesService = async () => {
    return await Roles.findAll({
        order: [['id', 'ASC']]
    });
};

export const getRolesByIdService = async (id) => {
    return await Roles.findByPk(id);
};

export const updateRolesService = async (id, data) => {
    const role = await Roles.findByPk(id);
    if (!role) return null;

    try {
        await role.update(data);
        return role;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El rol ya existe');
        }
        throw error;
    }
};

export const deleteRolesService = async (id) => {
    const role = await Roles.findByPk(id);
    if (!role) return null;

    const User = (await import("../models/user.js")).default;
    const usersWithRole = await User.count({ where: { idRol: id } });

    if (usersWithRole > 0) {
        throw new Error('No se puede eliminar el rol porque hay usuarios asignados');
    }

    await role.destroy();
    return role;
};