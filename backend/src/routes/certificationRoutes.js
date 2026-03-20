import express from "express";
import multer from "multer";
import Certification from "../models/Certification.js";
import User from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadEvidence.js";

const router = express.Router();

/* =============================
   APPLY (CREATE NEW)
============================= */

router.post(
  "/apply",
  authenticateUser,
  (req, res, next) => {
    upload.single("orgEvidence")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const newApplication = new Certification({
        company: req.user.id,
        ...req.body
      });

      await newApplication.save();

      res.json({ message: "Application submitted successfully" });

    } catch (err) {
      console.error("APPLY ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =============================
   ⭐ UPDATE (EDIT / REAPPLY)
============================= */

router.put("/update/:id", authenticateUser, async (req, res) => {
  try {
    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔐 Only owner can edit
    if (application.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    /* =============================
       🔁 SMART RESUBMISSION FLOW
    ============================= */

    if (application.status === "Changes Requested") {
      // 🔄 Go back to auditor
      application.status = "Auditor Assigned";
      application.auditorDecision = "";
      application.auditorRemarks = "";
    }

    else if (application.status === "Rejected") {
      // 🔄 Go back to admin only
      application.status = "Pending";
      application.rejectionReason = "";
    }

    else if (application.status === "Pending") {
      // Just editing before assignment
      application.status = "Pending";
    }

    // ✅ Update fields
    Object.assign(application, req.body);

    await application.save();

    res.json({ message: "Application resubmitted successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   ADMIN: GET ALL
============================= */

router.get("/all", authenticateUser, adminOnly, async (req, res) => {
  try {
    const applications = await Certification.find()
      .populate("company", "companyName email")
      .populate("assignedAuditor", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   ADMIN APPROVE
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
   ADMIN REJECT (UPDATED)
============================= */

router.put("/reject/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;

    console.log("Received reason:", reason); // ✅ DEBUG

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ UPDATE FIELDS
    application.status = "Rejected";
    application.rejectionReason = reason.trim();

    await application.save();

    console.log("Saved reason:", application.rejectionReason); // ✅ DEBUG

    // ✅ RETURN UPDATED OBJECT (IMPORTANT)
    res.json({
      message: "Application rejected",
      application
    });

  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   ASSIGN AUDITOR
============================= */

router.put("/assign/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const { username } = req.body;

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const auditor = await User.findOne({
      username,
      role: "auditor"
    });

    if (!auditor) {
      return res.status(400).json({ message: "Auditor not found" });
    }

    application.assignedAuditor = auditor._id;
    application.status = "Auditor Assigned";

    await application.save();

    res.json({ message: "Auditor assigned successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   AUDITOR GET APPLICATIONS
============================= */

router.get("/auditor-applications", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "auditor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Certification.find({
      assignedAuditor: req.user.id
    }).populate("company", "companyName email");

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   AUDITOR REVIEW
============================= */

router.put("/auditor-review/:id", authenticateUser, async (req, res) => {
  try {
    const { remarks, decision } = req.body;

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.auditorRemarks = remarks;
    application.auditorDecision = decision;

    if (decision === "Approved") {
      application.status = "Under Audit";
    }

    if (decision === "Changes Requested") {
      application.status = "Changes Requested";
    }

    await application.save();

    res.json({ message: "Audit submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   COMPANY GET OWN
============================= */

router.get("/my-applications", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Certification.find({
      company: req.user.id
    })
      .populate("assignedAuditor", "email username")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;