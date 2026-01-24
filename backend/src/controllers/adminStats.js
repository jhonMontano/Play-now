import { getAdminStatsService } from "../services/adminStats.js";

export const getAdminStats = async (req, res) => {
    try {
        const { mallId, startDate, endDate } = req.query;

        const stats = await getAdminStatsService({
            mallId,
            startDate,
            endDate
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