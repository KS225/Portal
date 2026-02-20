// backend/src/routes/authRoutes.js

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";

// ✅ Declare router
const router = express.Router();

// ===== REGISTER ROUTE =====
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

    const cinRegex = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

if (!cinRegex.test(registrationNumber)) {
  return res.status(400).json({
    message: "Invalid CIN format"
  });
}
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters long and include uppercase, lowercase, number, and special character."
      });
    }
    // ✅ Validate required fields
    if (
      !companyName || !registrationNumber || !industry || !contactPerson ||
      !designation || !email || !phone || !certificationType ||
      !startDate || !endDate || !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate registrationNumber is numeric
    if (isNaN(Number(registrationNumber))) {
      return res.status(400).json({ message: "Registration number must be numeric" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = new User({
      companyName,
      registrationNumber: Number(registrationNumber), // store as number
      industry,
      contactPerson,
      designation,
      email,
      phone,
      certificationType,
      startDate,
      endDate,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newUser.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== VERIFY OTP ROUTE =====
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== Number(otp)) return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Export router
export default router;
