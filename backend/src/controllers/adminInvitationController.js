import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import AuditorInvitation from "../models/AuditorInvitation.js";
import { sendOTPEmail } from "../utils/mailer.js"; // reuse mailer

// 🔥 Generate random username
const generateUsername = async () => {
  let username;
  let exists = true;

  while (exists) {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    username = `aud_${randomPart}`;

    const userExists = await User.findOne({ username });
    if (!userExists) exists = false;
  }

  return username;
};

// 🔥 Invite Auditor
export const inviteAuditor = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

// Check if already a registered user
const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({
    message: "This email is already registered in the system.",
  });
}

// Check if invitation already exists
const existingInvitation = await AuditorInvitation.findOne({ email });

if (existingInvitation) {
  // If still pending
  if (existingInvitation.status === "pending") {
    return res.status(400).json({
      message: "An active invitation already exists for this email.",
    });
  }

  // If already accepted
  if (existingInvitation.status === "accepted") {
    return res.status(400).json({
      message: "This auditor has already completed registration.",
    });
  }

  // If expired → remove old invitation
  if (existingInvitation.status === "expired") {
    await AuditorInvitation.deleteOne({ _id: existingInvitation._id });
  }
}
    // Generate username
    const username = await generateUsername();

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Save invitation
    await AuditorInvitation.create({
      email,
      username,
      token,
      expiresAt,
      invitedBy: req.user.id,
    });

    // Send email
    const inviteLink = `http://localhost:3000/auditor/setup?token=${token}`;

   const message = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #1f2d3d;">Auditor Invitation</h2>

  <p>Dear <strong>${username}</strong>,</p>

  <p>You have been invited to join the <strong>Granuler Certification Platform</strong> as an Auditor.</p>

  <p>Please click the button below to set your password and activate your account:</p>

  <p style="margin: 20px 0;">
    <a href="${inviteLink}" 
       style="background-color: #3f51b5; 
              color: #ffffff; 
              padding: 12px 20px; 
              text-decoration: none; 
              border-radius: 6px;
              display: inline-block;">
       Set Your Password
    </a>
  </p>

  <p>This link will expire in 48 hours.</p>

  <p>If you did not expect this invitation, you may safely ignore this email.</p>

  <br/>
  <p>Best Regards,<br/>Granuler Team</p>
</div>
`;

    await sendOTPEmail(email, message); // reuse mailer function

    res.json({ message: "Invitation sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};