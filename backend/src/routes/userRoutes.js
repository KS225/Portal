import express from "express";
import User from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Get Profile */
router.get("/profile", authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* Update Profile */
router.put("/update-profile", authenticateUser, async (req, res) => {
  const { contactPerson, designation, phone } = req.body;

  const user = await User.findById(req.user.id);

  user.contactPerson = contactPerson;
  user.designation = designation;
  user.phone = phone;

  await user.save();

  res.json({ message: "Profile updated successfully" });
});

export default router;