import User from "../models/User.js";
import bcrypt from "bcrypt";
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    await admin.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    res.json({
      totalCompanies,
      totalAdmins,
      message: "Dashboard stats fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};