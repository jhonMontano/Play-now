import { 
    getAdminStatsService, 
    getRevenueService, 
    getUsersCountService, 
    getMallsCountService 
} from "../services/adminStats.js";

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

export const getRevenue = async (req, res) => {
    try {
        const { idRol, mallId: mallFromToken } = req.user;
        const { mallId, startDate, endDate } = req.query;

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

        const revenue = await getRevenueService({
            mallId: finalMallId,
            startDate,
            endDate
        });

        res.json(revenue);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener ingresos",
            error: error.message
        });
    }
};

export const getUsersCount = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "Solo el super administrador puede acceder a esta información"
            });
        }

        const usersCount = await getUsersCountService();
        res.json(usersCount);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener conteo de usuarios",
            error: error.message
        });
    }
};

export const getMallsCount = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "Solo el super administrador puede acceder a esta información"
            });
        }

        const mallsCount = await getMallsCountService();
        res.json(mallsCount);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener conteo de centros comerciales",
            error: error.message
        });
    }
};
