import Mall from "../models/mall.js";
import Court from "../models/court.js";
import Sport from "../models/sport.js";
import Reservation from "../models/reservation.js";
import User from "../models/user.js";
import Roles from "../models/roles.js";
import { fn, col, Op, literal } from "sequelize";

export const getSuperAdminKPIs = async () => {
    try {
        const totalMalls = await Mall.count();

        const totalSports = await Sport.count();

        const totalActiveCourts = await Court.count({
            where: { activo: true }
        });

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthReservations = await Reservation.count({
            where: {
                fechaReserva: {
                    [Op.between]: [firstDay, lastDay]
                }
            }
        });

        return {
            totalMalls,
            totalSports,
            totalActiveCourts,
            monthReservations
        };
    } catch (error) {
        throw new Error(`Error al obtener KPIs: ${error.message}`);
    }
};

export const getRegisteredMalls = async () => {
    try {
        const malls = await Mall.findAll({
            attributes: [
                "id",
                "nombreCentro",
                "ciudad",
                "activo",
                "createdAt"
            ],
            include: [
                {
                    model: User,
                    as: "administrador",
                    attributes: ["id", "primerNombre", "primerApellido", "correo"]
                },
                {
                    model: Court,
                    as: "canchas",
                    attributes: ["id"],
                    required: false
                }
            ],
            order: [["createdAt", "DESC"]],
            raw: false
        });

        return malls.map(mall => ({
            id: mall.id,
            centroComercial: mall.nombreCentro,
            ciudad: mall.ciudad,
            adminAsignado: mall.administrador
                ? `${mall.administrador.primerNombre || ""} ${mall.administrador.primerApellido || ""}`.trim()
                : "N/A",
            canchas: mall.canchas?.length || 0,
            estado: mall.activo ? "activo" : "inactivo",
            fechaRegistro: mall.createdAt
        }));
    } catch (error) {
        throw new Error(`Error al obtener centros comerciales: ${error.message}`);
    }
};

export const getMallActivitySummary = async () => {
    try {
        const malls = await Mall.findAll({
            attributes: ["id", "nombreCentro"],
            include: [
                {
                    model: Court,
                    as: "canchas",
                    attributes: ["id"],
                    required: false
                },
                {
                    model: User,
                    as: "administrador",
                    attributes: ["primerNombre", "primerApellido"]
                }
            ]
        });

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const reservationData = await Reservation.findAll({
            attributes: [
                [col("cancha.mallId"), "mallId"],
                [fn("COUNT", col("Reservation.id")), "totalReservas"],
                [fn("SUM", col("valorTotal")), "ingresosTotales"]
            ],
            include: [
                {
                    model: Court,
                    as: "cancha",
                    attributes: [],
                    required: true
                }
            ],
            where: {
                fechaReserva: {
                    [Op.between]: [firstDay, lastDay]
                }
            },
            group: [col("cancha.mallId")],
            raw: true
        });

        const reservationMap = {};
        reservationData.forEach(data => {
            reservationMap[data.mallId] = {
                reservas: Number(data.totalReservas),
                ingresos: Number(data.ingresosTotales) || 0
            };
        });

        return malls.map(mall => ({
            id: mall.id,
            centroComercial: mall.nombreCentro,
            canchasTotal: mall.canchas?.length || 0,
            reservasEsteMes: reservationMap[mall.id]?.reservas || 0,
            ingresosEstimados: reservationMap[mall.id]?.ingresos || 0,
            admin: mall.administrador
                ? `${mall.administrador.primerNombre || ""} ${mall.administrador.primerApellido || ""}`.trim()
                : "N/A"
        }));
    } catch (error) {
        throw new Error(`Error al obtener resumen de actividad: ${error.message}`);
    }
};

export const getCreatedSports = async () => {
    try {
        const sports = await Sport.findAll({
            attributes: ["id", "nombre", "descripcion", "cantidad", "activo", "createdAt"],
            include: [
                {
                    model: Court,
                    as: "canchas",
                    attributes: ["id"],
                    required: false
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        return sports.map(sport => ({
            id: sport.id,
            deporte: sport.nombre,
            Descripción: sport.descripcion || "N/A",
            estado: sport.activo ? "activo" : "inactivo",
            canchasAsociadas: sport.canchas?.length || 0
        }));
    } catch (error) {
        throw new Error(`Error al obtener deportes: ${error.message}`);
    }
};

export const getMallAdministrators = async () => {
    try {
        const admins = await User.findAll({
            attributes: ["id", "primerNombre", "primerApellido", "correo", "idMall", "createdAt"],
            include: [
                {
                    model: Roles,
                    as: "rol",
                    attributes: ["nombre"],
                    where: { nombre: "admin" },
                    required: true
                },
                {
                    model: Mall,
                    as: "mallAdministrado",
                    attributes: ["id", "nombreCentro"],
                    required: false
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        return admins.map(admin => ({
            id: admin.id,
            nombre: `${admin.primerNombre || ""} ${admin.primerApellido || ""}`.trim(),
            correo: admin.correo,
            centroAsignado: admin.mallAdministrado?.nombreCentro || "Sin asignar",
            fechaCreacion: admin.createdAt
        }));
    } catch (error) {
        throw new Error(`Error al obtener administradores: ${error.message}`);
    }
};

export const getSuperAdminDashboardService = async () => {
    try {
        const [kpis, malls, mallActivity, sports, administrators] = await Promise.all([
            getSuperAdminKPIs(),
            getRegisteredMalls(),
            getMallActivitySummary(),
            getCreatedSports(),
            getMallAdministrators()
        ]);

        return {
            kpis,
            registeredMalls: malls,
            mallActivity,
            createdSports: sports,
            administrators
        };
    } catch (error) {
        throw new Error(`Error al obtener dashboard del Super Administrador: ${error.message}`);
    }
};
