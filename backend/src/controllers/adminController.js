import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* =========================
   CREATE USER
========================= */
export const createUser = async (req, res) => {
  try {
    const { username, role } = req.body;

    // 🔐 generate temp password
    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db.query(
      `INSERT INTO users 
      (username, password, role, is_verified, is_temp_password, is_active)
      VALUES (?, ?, ?, true, true, true)`,
      [username, hashedPassword, role]
    );

    // 🔥 send back credentials
    return res.json({
      username,
      tempPassword,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

/* =========================
   GET USERS
========================= */
export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, role, is_active FROM users WHERE role != 'APPLICANT'"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id;

    // ❌ Prevent self reset
    if (parseInt(id) === loggedInUserId) {
      return res.status(400).json({
        message: "Use profile settings to reset your password",
      });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);

    await db.query(
      "UPDATE users SET password=?, is_temp_password=true WHERE id=?",
      [hashed, id]
    );

    res.json({ tempPassword });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DEACTIVATE USER
========================= */
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 logged-in user
    const loggedInUserId = req.user.id;

    // ❌ Prevent self-deactivation
    if (parseInt(id) === loggedInUserId) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    await db.query(
      "UPDATE users SET is_active = false WHERE id = ?",
      [id]
    );

    res.json({ message: "User deactivated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const [total] = await db.query(
      "SELECT COUNT(*) as count FROM applications"
    );

    const [pending] = await db.query(
      "SELECT COUNT(*) as count FROM applications WHERE status = 'PENDING'"
    );

    const [paymentPending] = await db.query(
      "SELECT COUNT(*) as count FROM applications WHERE status = 'PAYMENT_PENDING'"
    );

    const [completed] = await db.query(
      "SELECT COUNT(*) as count FROM applications WHERE status = 'COMPLETED'"
    );

    res.json({
      total: total[0].count,
      pending: pending[0].count,
      paymentPending: paymentPending[0].count,
      completed: completed[0].count,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};