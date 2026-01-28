import {
    createRolesService,
    getAllRolesService,
    getRolesByIdService,
    updateRolesService,
    deleteRolesService
} from "../services/roles.js"

export const createRole = async (req, res) => {
    try {
        const role = await createRolesService(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};

export const getRoles = async (req, res) => {
    try {
        const roles = await getAllRolesService();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const role = await getRolesByIdService(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRole = async (req, res) => {
    try {
        const role = await updateRolesService(req.params.id, req.body);
        if (!role) {
            return res.status(404).json({ message: "Rol no enconrado" });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const role = await deleteRolesService(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json({ message: "Rol desativado correctamente"})
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};