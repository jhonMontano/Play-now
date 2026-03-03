import { getDashboardService } from "../services/dashboard.js";

export const getDashboard = async (req, res) => {
    try {

        const { idRol, mallId: mallFromToken } = req.user;
        const { mallId, startDate, endDate, estado, courtId, year } = req.query;

        let finalMallId;

        if (idRol === 2) {
            finalMallId = mallFromToken;
        } else if (idRol === 1) {
            finalMallId = mallId || undefined;
        } else {
            return res.status(403).json({
                message: "No tienes permisos"
            });
        }

        const dashboard = await getDashboardService({
            mallId: finalMallId,
            startDate,
            endDate,
            estado,
            courtId,
            year
        });

        res.json({
            message: "Dashboard obtenido correctamente",
            data: dashboard
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener dashboard",
            error: error.message
        });
    }
};