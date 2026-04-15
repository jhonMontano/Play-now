import {
  createReservationService,
  getReservationsService,
  getReservationByIdService,
  getReservationsByMallService,
  getReservationsByCourtService,
  updateReservationService,
  cancelReservationService,
} from "../services/reservation.js"; 

export const createReservation = async (req, res) => {
  try {
    const result = await createReservationService(req.user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservas = await getReservationsService(req.user);
    res.status(200).json({ reservas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await getReservationByIdService(req.user, id);
    res.status(200).json({ reserva });
  } catch (error) {
    if (error.message === "Reserva no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    res.status(403).json({ message: error.message });
  }
};

export const getReservationsByMall = async (req, res) => {
  try {
    const { mallId } = req.params;
    const reservas = await getReservationsByMallService(req.user, mallId);
    res.status(200).json({ reservas });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const getReservationsByCourt = async (req, res) => {
  try {
    const { courtId } = req.params;
    const reservas = await getReservationsByCourtService(req.user, courtId);
    res.status(200).json({ reservas });
  } catch (error) {
    if (error.message === "Cancha no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    res.status(403).json({ message: error.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateReservationService(req.user, id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Reserva no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cancelReservationService(req.user, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};