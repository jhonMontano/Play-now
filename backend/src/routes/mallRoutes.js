import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createMallAndAdmin,
  getAllMalls,
  getMallById,
  updateMall,
  deleteMall,
} from "../controllers/mallController.js";

const router = express.Router();

router.post("/", authenticateToken, createMallAndAdmin);
router.get("/", authenticateToken, getAllMalls);
router.get("/:id", authenticateToken, getMallById);
router.put("/:id", authenticateToken, updateMall);
router.delete("/:id", authenticateToken, deleteMall);

export default router;
