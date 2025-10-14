import express from "express";
import {
  register,
  listUsers,
  getUser,
  editUser,
  removeUser,
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.get("/", listUsers);  
router.get("/:id", getUser);  
router.put("/:id", editUser); 
router.delete("/:id", removeUser); 

export default router;
