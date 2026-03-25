import express from "express";
import {
  submitApplication,
  getMyApplications,
  getApplicationById
} from "../controllers/applicationController.js";
import { upload } from "../middleware/upload.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= GET ROUTES =================
router.get("/my", authenticateUser, getMyApplications);  // ✅ protected
router.get("/:id", authenticateUser, getApplicationById); // ✅ added auth (important)

// ================= POST ROUTE =================
router.post(
  "/submit",
  authenticateUser,
  upload.fields([
    { name: "gstDoc" },
    { name: "sezDoc" },
    { name: "companyProfile" },
    { name: "pitchDeck" },
    { name: "certifications" },
  ]),
  submitApplication
);

export default router;