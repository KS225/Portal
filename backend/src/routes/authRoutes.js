// backend/src/routes/authRoutes.js

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

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
      !companyName ||
      !registrationNumber ||
      !industry ||
      !contactPerson ||
      !designation ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔥 Check only verified users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 Create temporary token (valid 10 mins)
    const tempToken = jwt.sign(
      {
        companyName,
        registrationNumber,
        industry,
        contactPerson,
        designation,
        email,
        phone,
        password: hashedPassword,
        otp,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email",
      tempToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== VERIFY OTP ROUTE =====
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp, tempToken } = req.body;

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    if (decoded.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      companyName: decoded.companyName,
      registrationNumber: decoded.registrationNumber,
      industry: decoded.industry,
      contactPerson: decoded.contactPerson,
      designation: decoded.designation,
      email: decoded.email,
      phone: decoded.phone,
      password: decoded.password,
      isVerified: true,
    });

    await newUser.save();

    res.status(200).json({ message: "Account verified successfully" });

  } catch (err) {
    res.status(400).json({ message: "OTP expired or invalid" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your account first" });
    }

const token = jwt.sign(
  {
    id: user._id,
    role: user.role,   // 🔥 add role to token
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.json({
  token,
  user: {
    id: user._id,
    role: user.role,
    email: user.email,
  },
});

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== FORGOT PASSWORD =====
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate reset token (JWT valid for 15 mins)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // You can send this link via email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log("RESET LINK:", resetLink);

    res.json({ message: "Reset link generated", resetLink });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ===== RESET PASSWORD =====
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// ✅ Export router
export default router;
