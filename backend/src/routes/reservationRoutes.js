import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createReservation,
  getReservations,
  getReservationsByMall,
  cancelReservation,
} from "../controllers/reservation.js";

const router = Router();

router.post("/", authenticateToken, createReservation);
router.get("/", authenticateToken, getReservations);
router.get("/mall/:mallId", authenticateToken, getReservationsByMall);
router.put("/cancel/:id", authenticateToken, cancelReservation);

export default router;
