import express from "express";
import { login, logout, changePassword } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", authenticateToken, logout);

router.put("/change-password", authenticateToken, changePassword);

export default router;
