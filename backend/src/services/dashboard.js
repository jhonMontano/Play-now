import { getAdminStatsService } from "./adminStats.js";
import User from "../models/user.js";
import Mall from "../models/mall.js";
import Roles from "../models/roles.js";
import { fn, col, Op, literal } from "sequelize";

export const getDashboardService = async (filters) => {

    const year = filters.year || new Date().getFullYear();

    const reservations = await getAdminStatsService(filters);

    const totalMalls = await Mall.count();

    const totalUsers = await User.count();

    const totalAdmins = await User.count({
        include: [
            {
                model: Roles,
                as: "rol",
                where: { nombre: "admin" },
                required: true
            }
        ]
    });

    const totalClients = await User.count({
        include: [
            {
                model: Roles,
                as: "rol",
                where: { nombre: "usuario" },
                required: true
            }
        ]
    });

    const mallsByCityRaw = await Mall.findAll({
        attributes: [
            "ciudad",
            [fn("COUNT", col("Mall.id")), "total"]
        ],
        group: ["ciudad"],
        order: [["ciudad", "ASC"]],
        raw: true
    });

    const mallsByCity = mallsByCityRaw.map(m => ({
        ciudad: m.ciudad,
        total: Number(m.total)
    }));

    const usersByRoleRaw = await User.findAll({
        attributes: [
            [col("rol.nombre"), "rol"],
            [fn("COUNT", col("User.id")), "total"]
        ],
        include: [
            {
                model: Roles,
                as: "rol",
                attributes: [],
                required: true
            }
        ],
        group: ["rol.id", "rol.nombre"],
        order: [[literal("COUNT(\"User\".\"id\")"), "DESC"]],
        raw: true
    });

    const usersByRole = usersByRoleRaw.map(r => ({
        rol: r.rol,
        total: Number(r.total)
    }));

    const newUsersRaw = await User.findAll({
        attributes: [
            [
                fn("DATE_TRUNC", "month", col("createdAt")),
                "month"
            ],
            [fn("COUNT", col("User.id")), "total"]
        ],
        where: {
            createdAt: {
                [Op.between]: [
                    `${year}-01-01`,
                    `${year}-12-31`
                ]
            }
        },
        group: [fn("DATE_TRUNC", "month", col("createdAt"))],
        order: [[fn("DATE_TRUNC", "month", col("createdAt")), "ASC"]],
        raw: true
    });

    const newUsers = newUsersRaw.map(n => ({
        month: n.month,
        total: Number(n.total)
    }));

    return {
        reservations,
        summary: {
            totalMalls,
            totalUsers,
            totalAdmins,
            totalClients
        },
        mallsByCity,
        usersByRole,
        newUsers
    };
};