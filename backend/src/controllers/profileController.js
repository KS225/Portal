import db from "../config/db.js";

/* =========================
   GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        i.full_name,
        i.phone,
        i.department,
        i.designation
      FROM users u
      LEFT JOIN internal_users i ON u.id = i.user_id
      WHERE u.id = ?
    `, [userId]);

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, department, email, designation } = req.body;

    // 🔐 update email (users table)
    if (email) {
      const [existing] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      await db.query(
        "UPDATE users SET email = ? WHERE id = ?",
        [email, userId]
      );
    }

    // 🔐 insert/update internal profile
    await db.query(`
      INSERT INTO internal_users (user_id, full_name, phone, department, designation)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        phone = VALUES(phone),
        department = VALUES(department),
        designation = VALUES(designation)
    `, [userId, full_name, phone, department, designation]);

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   SEND OTP (FOR PASSWORD RESET)
========================= */
export const sendResetOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await db.query(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [otp, expiry, userId]
    );

    console.log("OTP:", otp); // 🔥 later replace with email

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   VERIFY OTP + RESET PASSWORD
========================= */
export const verifyOtpAndReset = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp, newPassword } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const user = users[0];

    if (!user || user.otp !== otp || new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const bcrypt = (await import("bcryptjs")).default;
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?",
      [hashed, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};