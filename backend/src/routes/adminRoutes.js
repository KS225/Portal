import express from "express";
import {
  createUser,
  getUsers,
  resetPassword,
  deactivateUser,
} from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-user", createUser);
router.get("/users", getUsers);
router.post("/reset-password/:id", resetPassword);
router.patch("/deactivate/:id", deactivateUser);

router.get("/dashboard-stats", authenticateUser, getDashboardStats);

export default router;