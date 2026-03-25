import {
  createSportService,
  getAllSportsService,
  getSportByIdService,
  updateSportService,
  getAllInactiveSportsService,
  getInactiveSportByIdService,
  hasCourtsAssociatedService,
  updateSportStatusService,
  deleteSportPermanentlyService
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
      return res.status(400).json({ message: error.message });
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

export const getInactiveSports = async (req, res) => {
  try {
    const sports = await getAllInactiveSportsService();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInactiveSportById = async (req, res) => {
  try {
    const sport = await getInactiveSportByIdService(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: "Deporte inactivo no encontrado" });
    }
    res.json(sport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSportStatus = async (req, res) => {
  try {
    const sportId = req.params.id;
    const { activo } = req.body;

    if (activo === undefined) {
      return res.status(400).json({
        message: "El campo 'activo' es requerido. Use true para activar o false para desactivar.",
        example: {
          activo: true 
        }
      });
    }

    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        message: "El campo 'activo' debe ser un valor booleano (true/false)"
      });
    }

    const sport = await updateSportStatusService(sportId, activo);

    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }

    const mensaje = activo
      ? "Deporte activado correctamente. Ya está disponible para nuevas canchas."
      : "Deporte desactivado correctamente. No estará disponible para nuevas canchas.";

    return res.status(200).json({
      message: mensaje,
      sport,
      action: activo ? "activated" : "deactivated"
    });
  } catch (error) {
    if (error.message.includes('ya está')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSportPermanently = async (req, res) => {
  try {
    const sportId = req.params.id;

    const sport = await getSportByIdService(sportId);
    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }

    const hasCourts = await hasCourtsAssociatedService(sportId);

    if (hasCourts) {
      return res.status(400).json({
        message: "No se puede eliminar el deporte porque tiene canchas asociadas",
        action: "use_deactivate",
        options: {
          deactivate: `/api/sports/${sportId}/deactivate`,
          view_courts: `/api/courts?sportId=${sportId}`
        }
      });
    }

    await deleteSportPermanentlyService(sportId);
    return res.status(200).json({
      message: "Deporte eliminado permanentemente",
      action: "deleted"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};