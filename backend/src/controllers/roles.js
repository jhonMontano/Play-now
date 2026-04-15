import {
    createRolesService,
    getAllRolesService,
    getRolesByIdService,
    updateRolesService,
    deleteRolesService
} from "../services/roles.js"

export const createRole = async (req, res) => {
    try {
        if (!req.body.nombre || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "El nombre del rol es requerido" });
        }

        if (req.user.idRol !== 1) {
            return res.status(403).json({ message: "Acceso denegado. Solo el super administrador puede crear roles" });
        }

        const role = await createRolesService(req.body);
        res.status(201).json({
            message: "Rol creado exitosamente",
            role: role
        });
    } catch (error) {
        if (error.message === 'El rol ya existe') {
            return res.status(400).json({ message: error.message });
        }
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
        if (req.user.idRol !== 1) {
            return res.status(403).json({ message: "Acceso denegado. Solo el super administrador puede actualizar roles" });
        }

        if (!req.body.nombre || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "El nombre del rol es requerido" });
        }

        const role = await updateRolesService(req.params.id, req.body);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json({
            message: "Rol actualizado exitosamente",
            role: role
        });
    } catch (error) {
        if (error.message === 'El rol ya existe') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        if (req.user.idRol !== 1) {
            return res.status(403).json({ message: "Acceso denegado. Solo el super administrador puede eliminar roles" });
        }

        const role = await deleteRolesService(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
        res.json({ message: "Rol eliminado exitosamente" });
    } catch (error) {
        if (error.message.includes('No se puede eliminar el rol porque hay usuarios asignados')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message});
    }
};