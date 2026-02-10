import Reservation from "../models/reservation.js";
import Court from "../models/court.js";
import Mall from "../models/mall.js";
import { Op, fn, col } from "sequelize";

export const getAdminStatsService = async ({
    mallId,
    startDate,
    endDate,
    estado,
    courtId
}) => {
    const where = {};

    if (estado) where.estado = estado;

    if (startDate && endDate) {
        where.fechaReserva = {
            [Op.between]: [startDate, endDate]
        };
    }

    if (courtId !== undefined && courtId !== null) {
        where["$cancha.id$"] = Number(courtId);
    }

    if (mallId !== undefined && mallId !== null) {
        where["$cancha.mall.id$"] = Number(mallId);
    }

    return await Reservation.findAll({
        where,
        attributes: [
            "estado",
            [fn("COUNT", fn("DISTINCT", col("Reservation.id"))), "total reservas"],
            [fn("SUM", col("valorTotal")), "ingresos"]
        ],
        include: [
            {
                model: Court,
                as: "cancha",
                attributes: [],
                include: [
                    {
                        model: Mall,
                        as: "mall",
                        attributes: []
                    }
                ]
            }
        ],
        group: ["estado"]
    });
};

