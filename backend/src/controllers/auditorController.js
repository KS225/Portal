import bcrypt from "bcrypt";
import User from "../models/User.js";
import AuditorInvitation from "../models/AuditorInvitation.js";

// 🔍 Verify Token
export const verifyInvitationToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const invitation = await AuditorInvitation.findOne({ token });

    if (!invitation) {
      return res.status(400).json({ message: "Invalid invitation link" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already used" });
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ message: "Invitation expired" });
    }

    res.json({
      email: invitation.email,
      username: invitation.username,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Complete Auditor Registration
export const completeAuditorRegistration = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const invitation = await AuditorInvitation.findOne({ token });

    if (!invitation || invitation.status !== "pending") {
      return res.status(400).json({ message: "Invalid or expired invitation" });
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ message: "Invitation expired" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Auditor User
    await User.create({
      username: invitation.username,
      email: invitation.email,
      password: hashedPassword,
      role: "auditor",
      isVerified: true,
    });

    // Mark invitation as accepted
    invitation.status = "accepted";
    await invitation.save();

    res.json({ message: "Account created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};