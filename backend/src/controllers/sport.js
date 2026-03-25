import {
  createSportService,
  getAllSportsService,
  getSportByIdService,
  updateSportService,
  getAllInactiveSportsService,
  getInactiveSportByIdService,
  hasCourtsAssociatedService,
  deactivateSportService,
  activateSportService,
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

export const deactivateSport = async (req, res) => {
  try {
    const sportId = req.params.id;
    
    const sport = await getSportByIdService(sportId);
    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }
    
    if (!sport.activo) {
      return res.status(400).json({ 
        message: "El deporte ya está desactivado",
        sport
      });
    }
    
    const deactivatedSport = await deactivateSportService(sportId);
    return res.status(200).json({ 
      message: "Deporte desactivado correctamente",
      sport: deactivatedSport,
      action: "deactivated"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activateSport = async (req, res) => {
  try {
    const sportId = req.params.id;
    
    const sport = await getSportByIdService(sportId);
    if (!sport) {
      return res.status(404).json({ message: "Deporte no encontrado" });
    }
    
    if (sport.activo) {
      return res.status(400).json({ 
        message: "El deporte ya está activo",
        sport
      });
    }
    
    const activatedSport = await activateSportService(sportId);
    return res.status(200).json({ 
      message: "Deporte activado correctamente. Ya está disponible para nuevas canchas.",
      sport: activatedSport,
      action: "activated"
    });
  } catch (error) {
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