import {
  createSportService,
  getAllSportsService,
  getSportByIdService,
  updateSportService,
  deleteSportService
} from "../services/sport.js";

export const createSport = async (req, res) => {
  try {
    const sport = await createSportService(req.body);
    res.status(201).json({
      message: "Deporte creado exitosamente",
      sport
    });
  } catch (error) {
    if (error.message === 'El nombre del deporte ya existe') {
      return res.status(400).json({
        message: error.message
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSports = async (req, res) => {
  try {
    const sports = await getAllSportsService();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSportById = async (req, res) => {
  try {
    const sport = await getSportByIdService(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }
    res.json(sport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSport = async (req, res) => {
  try {
    const sport = await updateSportService(req.params.id, req.body);
    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }
    res.json({
      message: "Deporte actualizado exitosamente",
      sport
    });
  } catch (error) {
    if (error.message === 'El nombre del deporte ya existe') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSport = async (req, res) => {
  try {
    const result = await deleteSportService(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }

    if (result.type === "deactivated") {
      return res.status(200).json({
        message: result.message,
        sport: result.sport
      });
    } else {
      return res.status(200).json({
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInactiveSports = async (req, res) => {
  try {
    const sports = await getAllSportsInactiveService();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};