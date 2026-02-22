import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getDashboardStats,
} from "../controllers/adminController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { inviteAuditor } from "../controllers/adminInvitationController.js";
import AuditorInvitation from "../models/AuditorInvitation.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/profile", authenticateUser, adminOnly, getAdminProfile);
router.put("/update-profile", authenticateUser, adminOnly, updateAdminProfile);
router.put("/change-password", authenticateUser, adminOnly, changeAdminPassword);
router.get("/dashboard-stats", authenticateUser, adminOnly, getDashboardStats);
router.post("/invite-auditor", authenticateUser, adminOnly, inviteAuditor);
router.get("/invitations", authenticateUser, adminOnly, async (req, res) => {
  const invitations = await AuditorInvitation.find().sort({ createdAt: -1 });
  res.json(invitations);
});
router.get(
  "/auditors",
  authenticateUser,
  adminOnly,
  async (req, res) => {
    try {
      const auditors = await User.find({
        role: "auditor",
      }).select("username email name createdAt");

      res.json(auditors);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
router.get(
  "/companies",
  authenticateUser,
  adminOnly,
  async (req, res) => {
    try {
      const companies = await User.find({
        role: "company",
      }).select(
        "companyName registrationNumber industry contactPerson designation email phone createdAt"
      );

      res.json(companies);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;