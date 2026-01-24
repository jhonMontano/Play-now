import Reservation from "../models/reservation.js";
import Court from "../models/court.js";
import Mall from "../models/mall.js";
import { Op, fn, col } from "sequelize";

export const getAdminStatsService = async ({ mallId, startDate, endDate }) => {
    const where = {};

    if (startDate && endDate) {
        where.fechaReserva = {
            [Op.between]: [startDate, endDate]
        };
    }

    if (mallId) {
        where["$cancha.mall.id$"] = mallId;
    }

    const stats = await Reservation.findAll({
        where,
        attributes: [
            "estado",
            [fn("COUNT", col("Reservation.id")), "total"],
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

    return stats;
};