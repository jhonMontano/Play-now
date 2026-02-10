import { getAdminStatsService } from "../services/adminStats.js";

export const getAdminStats = async (req, res) => {
    try {
        const { idRol, mallId: mallFromToken } = req.user;
        const {
            mallId,
            startDate,
            endDate,
            estado,
            courtId
        } = req.query;

        let finalMallId = mallId;

        if (idRol === 2) {
            finalMallId = mallFromToken;
        } else if (idRol === 1) {
            finalMallId = mallId || undefined;
        } else {
            return res.status(403).json({
                message: "No tienes permisos para acceder a este recurso"
            });
        }

        const stats = await getAdminStatsService({
            mallId: finalMallId,
            startDate,
            endDate,
            estado,
            courtId
        });

        res.json({
            message: "Estadísticas obtenidas correctamente",
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};
