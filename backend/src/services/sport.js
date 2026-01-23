import Sport from "../models/sport.js";

export const createSportService = async (data) => {
    return await Sport.create(data);
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

    await sport.update(data);
    return sport;
};

export const deleteSportService = async (id) => {
    const sport = await Sport.findByPk(id);
    if (!sport) return null;

    await sport.update({ activo: false });
    return sport;
};
