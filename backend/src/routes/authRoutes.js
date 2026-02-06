import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const {
      companyName,
      registrationNumber,
      industry,
      contactPerson,
      designation,
      email,
      phone,
      certificationType,
      startDate,
      endDate,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      companyName,
      registrationNumber,
      industry,
      contactPerson,
      designation,
      email,
      phone,
      certificationType,
      startDate,
      endDate,
      password: hashedPassword,
      isVerified: false
    });

    await user.save();

    // Later: send OTP here
    res.status(201).json({ message: "OTP sent to email" });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

export default router;
