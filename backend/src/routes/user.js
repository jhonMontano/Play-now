import express from "express";
import {
  register,
  listUsers,
  getUser,
  editUser,
  removeUser,
  resetPassword,
  resetPasswordConfirm,
} from "../controllers/user.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.get("/", authenticateToken, listUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, editUser);
router.delete("/:id", authenticateToken, removeUser);
router.post("/reset-password", resetPassword);
router.post("/reset-password/confirm", resetPasswordConfirm);

export default router;
