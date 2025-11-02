import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createCourt, getCourts, getCourtById, updateCourt, deleteCourt
} from "../controllers/court.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Formato no permitido. Solo .jpg, .png y .pdf"));
    }
    cb(null, true);
  }
});

router.post("/", authenticateToken, upload.single("imagen"), createCourt);
router.get("/", authenticateToken, getCourts);
router.get("/:id", authenticateToken, getCourtById);
router.put("/:id", authenticateToken, updateCourt);
router.delete("/:id", authenticateToken, deleteCourt);

export default router;
