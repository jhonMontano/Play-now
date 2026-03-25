import Sport from "../models/sport.js";
import Court from "../models/court.js";

export const createSportService = async (data) => {
    try {
        return await Sport.create(data);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El nombre del deporte ya existe');
        }
        throw error;
    }
};

export const getAllSportsService = async () => {
    return await Sport.findAll({ where: { activo: true } });
};

export const getSportByIdService = async (id) => {
    return await Sport.findByPk(id);
};

export const updateSportService = async (id, data) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    if (data.nombre && data.nombre !== sport.nombre) {
        const existingSport = await Sport.findOne({
            where: { nombre: data.nombre }
        });
        if (existingSport) {
            throw new Error('El nombre del deporte ya existe');
        }
    }

    await sport.update(data);
    return sport;
};

export const deleteSportService = async (id) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    const courtsCount = await Court.count({ where: { sportId: id } });

    if (courtsCount > 0) {
        await sport.update({ activo: false });
        return {
            sport,
            message: "El deporte tiene canchas asociadas, se ha desactivado correctamente",
            type: "deactivated"
        };
    } else {
        await sport.destroy();
        return {
            sport,
            message: "Deporte eliminado permanentemente",
            type: "deleted"
        };
    }
};

export const getAllSportsInactiveService = async () => {
    return await Sport.findAll({ where: { activo: false } });
};