import { getSuperAdminDashboardService } from "../services/superAdminDashboard.js";
import { getMallAdminDashboardService } from "../services/mallAdminDashboard.js";

/**
 * Controlador para obtener el dashboard según el rol del usuario
 * - Rol 1: Super Administrador
 * - Rol 2: Administrador del Centro Comercial
 */
export const getDashboard = async (req, res) => {
    try {
        const { idRol, mallId: mallFromToken } = req.user;

        // Super Administrador (idRol === 1)
        if (idRol === 1) {
            const dashboard = await getSuperAdminDashboardService();
            return res.json({
                message: "Dashboard de Super Administrador obtenido correctamente",
                data: dashboard
            });
        }

        // Administrador del Centro (idRol === 2)
        if (idRol === 2) {
            if (!mallFromToken) {
                return res.status(403).json({
                    message: "No tienes un centro comercial asignado"
                });
            }

            const dashboard = await getMallAdminDashboardService(mallFromToken);
            return res.json({
                message: "Dashboard del Centro obtenido correctamente",
                data: dashboard
            });
        }

        // Otro rol no permitido
        return res.status(403).json({
            message: "No tienes permisos para acceder al dashboard"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener dashboard",
            error: error.message
        });
    }
};