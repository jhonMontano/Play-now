import express from "express";
import {
  register,
  listUsers,
  getUser,
  editUser,
  removeUser,
} from "../controllers/user.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.get("/", authenticateToken, listUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, editUser);
router.delete("/:id", authenticateToken, removeUser);

export default router;
