import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js"
import {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} from "../controllers/roles.js"

const router = express.Router();

router.post("/", authenticateToken, createRole);
router.get("/", authenticateToken, getRoles);
router.get("/:id", authenticateToken, getRoleById);
router.put("/:id", authenticateToken, updateRole);
router.delete("/:id", authenticateToken, deleteRole);

export default router;