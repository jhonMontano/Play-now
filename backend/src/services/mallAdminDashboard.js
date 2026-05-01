import Court from "../models/court.js";
import Reservation from "../models/reservation.js";
import User from "../models/user.js";
import Sport from "../models/sport.js";
import { fn, col, Op, where } from "sequelize";

export const getMallAdminKPIs = async (mallId) => {
    try {
        const totalCourts = await Court.count({
            where: { mallId, activo: true }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const todayReservations = await Reservation.count({
            where: {
                fechaReserva: {
                    [Op.between]: [today, endOfDay]
                }
            },
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: [],
                    where: { mallId },
                    required: true
                }
            ]
        });

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthReservations = await Reservation.count({
            where: {
                fechaReserva: {
                    [Op.between]: [firstDay, lastDay]
                }
            },
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: [],
                    where: { mallId },
                    required: true
                }
            ]
        });

        const now_time = new Date();
        const availableCourts = await Court.count({
            where: {
                mallId,
                activo: true
            },
            include: [
                {
                    model: Reservation,
                    as: "reservas",
                    attributes: [],
                    where: {
                        estado: "Activa",
                        [Op.or]: [
                            {
                                horaReserva: { [Op.lte]: now_time },
                                cantidadHoras: { [Op.gt]: 0 }
                            }
                        ]
                    },
                    required: false
                }
            ],
            subQuery: false,
            having: where(
                fn("COUNT", col("reservas.id")),
                Op.eq,
                0
            ),
            group: ["Court.id"]
        });

        return {
            totalCourts,
            todayReservations,
            monthReservations,
            availableCourtNow: availableCourts || 0
        };
    } catch (error) {
        throw new Error(`Error al obtener KPIs del admin: ${error.message}`);
    }
};

export const getMallCourts = async (mallId) => {
    try {
        const courts = await Court.findAll({
            where: { mallId },
            attributes: [
                "id",
                "nombreCancha",
                "valorHora",
                "activo",
                "createdAt"
            ],
            include: [
                {
                    model: Sport,
                    as: "deporte",
                    attributes: ["nombre", "cantidad"]
                },
                {
                    model: Reservation,
                    as: "reservas",
                    attributes: [
                        "id",
                        "estado",
                        "fechaReserva",
                        "horaReserva",
                        "cantidadHoras"
                    ],
                    where: {
                        estado: "Activa"
                    },
                    required: false
                }
            ],
            order: [["nombreCancha", "ASC"]]
        });

        return courts.map(court => {
            let disponibilidad = "Disponible";

            if (court.reservas && court.reservas.length > 0) {
                const activeReservation = court.reservas.find(res => {
                    const reservationDate = new Date(res.fechaReserva);

                    return (
                        res.estado === "Activa" &&
                        reservationDate.toDateString() === new Date().toDateString()
                    );
                });

                disponibilidad = activeReservation
                    ? "Ocupada"
                    : "Disponible";
            }

            return {
                id: court.id,
                cancha: court.nombreCancha,
                deporte: court.deporte?.nombre || "N/A",
                cantidad: court.deporte?.cantidad || 0,
                valorHora: court.valorHora,
                estado: court.activo ? "activo" : "inactivo",
                disponibilidad
            };
        });

    } catch (error) {
        throw new Error(`Error al obtener canchas: ${error.message}`);
    }
};

export const getRecentReservations = async (mallId, limit = 10) => {
    try {
        const reservations = await Reservation.findAll({
            attributes: [
                "id",
                "estado",
                "fechaReserva",
                "horaReserva",
                "cantidadHoras"
            ],
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: ["nombreCancha"],
                    where: { mallId },
                    required: true,
                    include: [
                        {
                            model: Sport,
                            as: "deporte",
                            attributes: ["nombre"]
                        }
                    ]
                },
                {
                    model: User,
                    as: "cliente",
                    attributes: ["primerNombre", "primerApellido", "correo"]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            subQuery: false
        });

        return reservations.map(reservation => ({
            id: reservation.id,
            usuario: reservation.cliente
                ? `${reservation.cliente.primerNombre || ""} ${reservation.cliente.primerApellido || ""}`.trim()
                : "N/A",
            cancha: reservation.cancha?.nombreCancha || "N/A",
            deporte: reservation.cancha?.deporte?.nombre || "N/A",
            fecha: reservation.fechaReserva,
            hora: reservation.horaReserva,
            duracion: `${reservation.cantidadHoras || 0} horas`,
            estado: reservation.estado
        }));
    } catch (error) {
        throw new Error(`Error al obtener reservas recientes: ${error.message}`);
    }
};

export const getTopCourts = async (mallId) => {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const topCourts = await Reservation.findAll({
            attributes: [
                [col("cancha.id"), "courtId"],
                [col("cancha.nombreCancha"), "courtName"],
                [col("cancha.deporte.nombre"), "sportName"],
                [fn("COUNT", col("Reservation.id")), "totalReservas"],
                [fn("SUM", col("cantidadHoras")), "horasOcupadas"]
            ],
            where: {
                fechaReserva: {
                    [Op.between]: [firstDay, lastDay]
                },
                estado: "Activa"
            },
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: [],
                    where: { mallId },
                    required: true,
                    include: [
                        {
                            model: Sport,
                            as: "deporte",
                            attributes: []
                        }
                    ]
                }
            ],
            group: [col("cancha.id"), col("cancha.nombreCancha"), col("cancha.deporte.nombre")],
            order: [[fn("COUNT", col("Reservation.id")), "DESC"]],
            limit: 5,
            raw: true,
            subQuery: false
        });

        const courtIds = topCourts.map(c => c.courtId);
        const courtsData = await Court.findAll({
            attributes: ["id", "valorHora"],
            where: { id: courtIds }
        });

        const courtsMap = {};
        courtsData.forEach(court => {
            courtsMap[court.id] = court;
        });

        return topCourts.map(court => {
            const hoursInMonth = 24 * 30; 
            const occupationPercentage = ((Number(court.horasOcupadas) || 0) / hoursInMonth * 100).toFixed(2);

            return {
                cancha: court.courtName,
                deporte: court.sportName,
                reservas: Number(court.totalReservas),
                mes: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
                horasOcupadas: Number(court.horasOcupadas) || 0,
                porcentajeOcupacion: `${occupationPercentage}%`
            };
        });
    } catch (error) {
        throw new Error(`Error al obtener top canchas: ${error.message}`);
    }
};

export const getDayReservationStatus = async (mallId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const reservations = await Reservation.findAll({
            attributes: [
                "id",
                "horaReserva",
                "cantidadHoras",
                "estado",
                "fechaReserva"
            ],
            where: {
                fechaReserva: {
                    [Op.between]: [today, endOfDay]
                }
            },
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: ["nombreCancha"],
                    where: { mallId },
                    required: true
                },
                {
                    model: User,
                    as: "cliente",
                    attributes: ["primerNombre", "primerApellido", "correo"]
                }
            ],
            order: [["horaReserva", "ASC"]],
            subQuery: false
        });

        return reservations.map(reservation => ({
            id: reservation.id,
            hora: reservation.horaReserva,
            cancha: reservation.cancha?.nombreCancha || "N/A",
            usuario: reservation.cliente
                ? `${reservation.cliente.primerNombre || ""} ${reservation.cliente.primerApellido || ""}`.trim()
                : "N/A",
            duracion: `${reservation.cantidadHoras || 0} horas`,
            fecha: reservation.fechaReserva,
            estado: reservation.estado
        }));
    } catch (error) {
        throw new Error(`Error al obtener estado del día: ${error.message}`);
    }
};

export const getMallAdminDashboardService = async (mallId) => {
    try {
        const [kpis, myCourts, recentReservations, topCourts, dayStatus] = await Promise.all([
            getMallAdminKPIs(mallId),
            getMallCourts(mallId),
            getRecentReservations(mallId),
            getTopCourts(mallId),
            getDayReservationStatus(mallId)
        ]);

        return {
            kpis,
            myCourts,
            recentReservations,
            topCourts,
            dayReservationStatus: dayStatus
        };
    } catch (error) {
        throw new Error(`Error al obtener dashboard del Admin del Centro: ${error.message}`);
    }
};
