import express from "express";
import {
  verifyInvitationToken,
  completeAuditorRegistration,
} from "../controllers/auditorController.js";

const router = express.Router();

router.get("/verify-token", verifyInvitationToken);
router.post("/complete-registration", completeAuditorRegistration);

export default router;