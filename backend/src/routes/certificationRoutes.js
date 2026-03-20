import express from "express";
import multer from "multer";
import Certification from "../models/Certification.js";
import User from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadEvidence.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
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

    if (application.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    /* =============================
       🔁 FIXED RESUBMISSION FLOW
    ============================= */

    if (application.status === "Changes Requested") {
      application.status = "Auditor Assigned";

      // ✅ CLEAR OLD AUDIT DATA
      application.auditorDecision = "";
      application.auditorRemarks = "";
    }

    else if (application.status === "Rejected") {
      application.status = "Pending";
      application.rejectionReason = "";
    }

    /* =============================
       ❗ VERY IMPORTANT FIX
    ============================= */

    const updatedData = { ...req.body };

    // ❌ prevent overwrite of audit fields
    delete updatedData.auditorDecision;
    delete updatedData.auditorRemarks;
    delete updatedData.status;

    Object.assign(application, updatedData);

    await application.save();

    res.json({
      message: "Application resubmitted successfully",
      application
    });

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
    const application = await Certification.findById(req.params.id)
      .populate("company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "Approved";
    application.rejectionReason = "";

    /* =============================
       📄 GENERATE CERTIFICATE
    ============================= */

    const dir = path.join(process.cwd(), "certificates");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const fileName = `certificate-${application._id}.pdf`;
    const filePath = path.join(dir, fileName);

    
const doc = new PDFDocument({
  size: "A4",
  layout: "landscape",
  margin: 50,
});

const stream = fs.createWriteStream(filePath);
doc.pipe(stream);

/* =============================
   🎨 BORDER
============================= */
doc
  .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
  .lineWidth(3)
  .stroke();

/* =============================
   🎓 TITLE
============================= */
doc
  .fontSize(32)
  .font("Helvetica-Bold")
  .text("CERTIFICATE OF APPROVAL", { align: "center" });

doc.moveDown(1.5);

/* =============================
   SUBTITLE
============================= */
doc
  .fontSize(18)
  .font("Helvetica")
  .text("This is to certify that", { align: "center" });

doc.moveDown(1);

/* =============================
   COMPANY NAME
============================= */
doc
  .fontSize(28)
  .font("Helvetica-Bold")
  .fillColor("#1a73e8")
  .text(application.company.companyName, { align: "center" });

doc.fillColor("black");
doc.moveDown(1);

/* =============================
   BODY TEXT
============================= */
doc
  .fontSize(16)
  .text(
    "has successfully completed the certification audit process and is hereby recognized as compliant.",
    { align: "center" }
  );

doc.moveDown(2);

/* =============================
   CERTIFICATE DETAILS
============================= */
const certId = `CERT-${application._id.toString().slice(-6).toUpperCase()}`;

doc.fontSize(12);
doc.text(`Certificate ID: ${certId}`, 100, 400);

doc.text(
  `Date: ${new Date().toLocaleDateString()}`,
  doc.page.width - 250,
  400
);

/* =============================
   SIGNATURE
============================= */
doc.moveTo(150, 500).lineTo(300, 500).stroke();
doc.text("Authorized Signature", 160, 510);

doc.moveTo(doc.page.width - 300, 500)
  .lineTo(doc.page.width - 150, 500)
  .stroke();

doc.text("Certification Authority", doc.page.width - 280, 510);

/* =============================
   SEAL
============================= */
doc.circle(doc.page.width / 2, 500, 40).stroke();

doc
  .fontSize(10)
  .text("VERIFIED", doc.page.width / 2 - 25, 495);

/* =============================
   FINISH (ONLY ONCE)
============================= */
doc.end();

    /* =============================
       ✅ IMPORTANT FIX
    ============================= */

    stream.on("finish", async () => {
      application.certificateUrl = filePath;

      await application.save();

      res.json({
        message: "Approved & Certificate Generated",
        certificateUrl: filePath,
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* =============================
   ADMIN REJECT (UPDATED)
============================= */
router.put("/reject/:id", authenticateUser, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔒 BLOCK REJECTION AFTER APPROVAL
    if (application.status === "Approved") {
      return res.status(400).json({
        message: "Approved application cannot be rejected",
      });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Rejection reason required",
      });
    }

    application.status = "Rejected";
    application.rejectionReason = reason.trim();

    await application.save();

    res.json({ message: "Application rejected" });

  } catch (err) {
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

router.get("/download-certificate/:id", authenticateUser, async (req, res) => {
  try {
    const application = await Certification.findById(req.params.id);

    if (!application || !application.certificateUrl) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.download(application.certificateUrl);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;