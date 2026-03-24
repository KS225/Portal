import express from "express";
import { submitApplication } from "../controllers/applicationController.js";
import { upload } from "../middleware/upload.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

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