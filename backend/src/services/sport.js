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
    return await Sport.findAll();
};

export const getSportByIdService = async (id) => {
    return await Sport.findByPk(id);
};

export const updateSportService = async (id, data) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    const { activo, ...updateData } = data;

    if (data.activo !== undefined) {
        throw new Error('No se puede modificar el estado del deporte. Use los endpoints /activate o /deactivate');
    }

    if (updateData.nombre && updateData.nombre !== sport.nombre) {
        const existingSport = await Sport.findOne({
            where: { nombre: updateData.nombre }
        });
        if (existingSport) {
            throw new Error('El nombre del deporte ya existe');
        }
    }

    await sport.update(updateData);
    return sport;
};

export const getAllActiveSportsService = async () => {
    return await Sport.findAll({
        where: { activo: true },
        order: [['updatedAt', 'DESC']]
    });
};

export const getInactiveSportByIdService = async (id) => {
    return await Sport.findOne({
        where: { id, activo: false }
    });
};

export const hasCourtsAssociatedService = async (sportId) => {
    const count = await Court.count({ where: { sportId } });
    return count > 0;
};

export const updateSportStatusService = async (id, activo) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    if (sport.activo === activo) {
        const estado = activo ? 'activo' : 'inactivo';
        throw new Error(`El deporte ya está ${estado}`);
    }

    await sport.update({ activo });
    return sport;
};

export const deleteSportPermanentlyService = async (id) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    const hasCourts = await hasCourtsAssociatedService(id);
    if (hasCourts) {
        throw new Error('No se puede eliminar un deporte que tiene canchas asociadas');
    }

    await sport.destroy();
    return sport;
};