import {
    getSuperAdminKPIs,
    getRegisteredMalls,
    getMallActivitySummary,
    getCreatedSports,
    getMallAdministrators
} from "../services/superAdminDashboard.js";

import {
    getMallAdminKPIs,
    getMallCourts,
    getRecentReservations,
    getTopCourts,
    getDayReservationStatus
} from "../services/mallAdminDashboard.js";

export const getSuperAdminKPIsController = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        const kpis = await getSuperAdminKPIs();

        res.json({
            message: "KPIs del Super Administrador obtenidos correctamente",
            data: kpis
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener KPIs",
            error: error.message
        });
    }
};

export const getRegisteredMallsController = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        const malls = await getRegisteredMalls();

        res.json({
            message: "Centros comerciales registrados obtenidos correctamente",
            data: malls
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener centros comerciales",
            error: error.message
        });
    }
};

export const getMallActivityController = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        const activity = await getMallActivitySummary();

        res.json({
            message: "Resumen de actividad por centro obtenido correctamente",
            data: activity
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener resumen de actividad",
            error: error.message
        });
    }
};

export const getCreatedSportsController = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        const sports = await getCreatedSports();

        res.json({
            message: "Deportes creados obtenidos correctamente",
            data: sports
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener deportes",
            error: error.message
        });
    }
};

export const getMallAdministratorsController = async (req, res) => {
    try {
        const { idRol } = req.user;

        if (idRol !== 1) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        const admins = await getMallAdministrators();

        res.json({
            message: "Administradores de centros obtenidos correctamente",
            data: admins
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener administradores",
            error: error.message
        });
    }
};

export const getMallAdminKPIsController = async (req, res) => {
    try {
        const { idRol, mallId } = req.user;

        if (idRol !== 2) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        if (!mallId) {
            return res.status(403).json({
                message: "No tienes un centro comercial asignado"
            });
        }

        const kpis = await getMallAdminKPIs(mallId);

        res.json({
            message: "KPIs del centro obtenidos correctamente",
            data: kpis
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener KPIs del centro",
            error: error.message
        });
    }
};

export const getMallCourtsController = async (req, res) => {
    try {
        const { idRol, mallId } = req.user;

        if (idRol !== 2) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        if (!mallId) {
            return res.status(403).json({
                message: "No tienes un centro comercial asignado"
            });
        }

        const courts = await getMallCourts(mallId);

        res.json({
            message: "Canchas del centro obtenidas correctamente",
            data: courts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener canchas",
            error: error.message
        });
    }
};

export const getRecentReservationsController = async (req, res) => {
    try {
        const { idRol, mallId } = req.user;
        const { limit = 10 } = req.query;

        if (idRol !== 2) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        if (!mallId) {
            return res.status(403).json({
                message: "No tienes un centro comercial asignado"
            });
        }

        const reservations = await getRecentReservations(mallId, parseInt(limit));

        res.json({
            message: "Reservas recientes obtenidas correctamente",
            data: reservations
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener reservas recientes",
            error: error.message
        });
    }
};

export const getTopCourtsController = async (req, res) => {
    try {
        const { idRol, mallId } = req.user;

        if (idRol !== 2) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        if (!mallId) {
            return res.status(403).json({
                message: "No tienes un centro comercial asignado"
            });
        }

        const topCourts = await getTopCourts(mallId);

        res.json({
            message: "Top 5 canchas obtenidas correctamente",
            data: topCourts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener top canchas",
            error: error.message
        });
    }
};

export const getDayReservationStatusController = async (req, res) => {
    try {
        const { idRol, mallId } = req.user;

        if (idRol !== 2) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a esta información"
            });
        }

        if (!mallId) {
            return res.status(403).json({
                message: "No tienes un centro comercial asignado"
            });
        }

        const dayStatus = await getDayReservationStatus(mallId);

        res.json({
            message: "Estado del día obtenido correctamente",
            data: dayStatus
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estado del día",
            error: error.message
        });
    }
};
