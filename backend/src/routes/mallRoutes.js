import express from "express";
import { createMallAndAdmin } from "../controllers/mallController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createMallAndAdmin);

export default router;
