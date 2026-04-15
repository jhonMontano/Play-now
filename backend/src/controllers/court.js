import {
  createCourtService,
  getCourtsService,
  getCourtByIdService,
  updateCourtService,
  deleteCourtService,
  getCourtsByMallIdService,
  statusCourtService,
  getActiveCourtService,
  getActiveCourtsByMallIdService
} from "../services/court.js";

export const createCourt = async (req, res) => {
  try {
    const court = await createCourtService(req.user, req.body, req.file);
    res.status(201).json({ message: "Cancha creada exitosamente", court });
  } catch (error) {
    if (error.message.includes("Solo el administrador")) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
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
    const court = await updateCourtService(req.params.id, req.body, req.file);
    res.json({ message: "Cancha actualizada exitosamente", court });
  } catch (error) {
    if (error.message.includes("Solo el administrador") || error.message.includes("No tienes permisos")) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes("no encontrada") || error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteCourt = async (req, res) => {
  try {
    const { idRol } = req.user;
    if (idRol !== 2) {
      return res.status(403).json({ message: "Solo el administrador puede eliminar canchas" });
    }
    await deleteCourtService(req.params.id);
    res.json({ message: "Cancha eliminada exitosamente" });
  } catch (error) {
    if (error.message.includes("Solo el administrador") || error.message.includes("No tienes permisos")) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes("no encontrada")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getCourtsByMallId = async (req, res) => {
  try {
    const { mallId } = req.params;
    const courts = await getCourtsByMallIdService(mallId, req.user);
    res.status(200).json({ courts });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const statusCourt = async (req, res) => {
  try {
    const result = await statusCourtService(req.params.id, req.body);
    res.json({ message: result.message, court: result.cancha });
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getActiveCourts = async (req, res) => {
  try {
    const canchas = await getActiveCourtService(req.user);
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveCourtsByMallId = async (req, res) => {
  try {
    const { mallId } = req.params;
    const canchas = await getActiveCourtsByMallIdService(mallId);
    res.status(200).json(canchas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
