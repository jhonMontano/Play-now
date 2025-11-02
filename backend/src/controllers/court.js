import {
  createCourtService,
  getCourtsService,
  getCourtByIdService,
  updateCourtService,
  deleteCourtService
} from "../services/court.js";

export const createCourt = async (req, res) => {
  try {
    const cancha = await createCourtService(req.user, req.body, req.file);
    res.status(201).json({ message: "Cancha registrada correctamente", cancha });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCourts = async (req, res) => {
  try {
    const canchas = await getCourtsService(req.user);
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourtById = async (req, res) => {
  try {
    const cancha = await getCourtByIdService(req.params.id);
    res.json(cancha);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCourt = async (req, res) => {
  try {
    const cancha = await updateCourtService(req.params.id, req.body);
    res.json({ message: "Cancha actualizada", cancha });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCourt = async (req, res) => {
  try {
    await deleteCourtService(req.params.id);
    res.json({ message: "Cancha eliminada" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
