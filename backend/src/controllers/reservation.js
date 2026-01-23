import {
  createReservationService,
  getReservationsService,
  getReservationsByMallService,
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
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservationsByMall = async (req, res) => {
  try {
    const { mallId } = req.params;
    const reservas = await getReservationsByMallService(req.user, mallId);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(403).json({ message: error.message });
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