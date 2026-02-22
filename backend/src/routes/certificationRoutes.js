import express from "express";
import Certification from "../models/Certification.js";
import User from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =============================
   Company Submit Application
============================= */

router.post("/apply", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newApplication = new Certification({
      company: req.user.id,
      ...req.body,
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   Admin Get All Applications
============================= */

router.get("/all", authenticateUser, adminOnly, async (req, res) => {
  try {
    const applications = await Certification.find()
      .populate("company", "companyName email")
      .populate("assignedAuditor", "email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   Admin Approve
============================= */

router.put("/approve/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "Approved";
    application.rejectionReason = "";
    await application.save();

    res.json({ message: "Application approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   Admin Reject
============================= */

router.put("/reject/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "Rejected";
    application.rejectionReason = reason;

    await application.save();

    res.json({ message: "Application rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   Admin Assign Auditor
============================= */

router.put("/assign/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const { auditorId } = req.body;

    const auditor = await User.findById(auditorId);

    if (!auditor || auditor.role !== "auditor") {
      return res.status(400).json({ message: "Invalid auditor" });
    }

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.assignedAuditor = auditorId;
    application.status = "Auditor Assigned";

    await application.save();

    res.json({ message: "Auditor assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   Company Get Own Applications
============================= */

router.get(
  "/my-applications",
  authenticateUser,
  async (req, res) => {
    try {
      if (req.user.role !== "company") {
        return res.status(403).json({ message: "Access denied" });
      }

      const applications = await Certification.find({
        company: req.user.id,
      })
        .populate("assignedAuditor", "email")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;