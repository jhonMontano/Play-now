import Reservation from "../models/reservation.js";
import Court from "../models/court.js";
import Mall from "../models/mall.js";
import User from "../models/user.js";
import { Op, fn, col, literal } from "sequelize";

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

export const getRevenueService = async ({ mallId, startDate, endDate }) => {
    const where = {};

    if (startDate && endDate) {
        where.fechaReserva = {
            [Op.between]: [startDate, endDate]
        };
    }

    if (mallId !== undefined && mallId !== null) {
        where["$cancha.mall.id$"] = Number(mallId);
    }

    const result = await Reservation.findAll({
        where,
        attributes: [
            [fn("SUM", col("Reservation.valorTotal")), "totalRevenue"]
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
        raw: true,
        subQuery: false
    });

    return {
        totalRevenue: Number(result[0]?.totalRevenue || 0)
    };
};

export const getUsersCountService = async () => {
    const totalUsers = await User.count();

    const usersByRole = await User.findAll({
        attributes: [
            "idRol",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["idRol"]
    });

    return {
        totalUsers,
        usersByRole
    };
};

export const getMallsCountService = async () => {
    const totalMalls = await Mall.count();

    const mallsByCity = await Mall.findAll({
        attributes: [
            "ciudad",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["ciudad"]
    });

    return {
        totalMalls,
        mallsByCity
    };
};

