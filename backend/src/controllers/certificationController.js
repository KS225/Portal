import Certification from "../models/Certification.js";
import User from "../models/User.js";

export const assignAuditor = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Auditor username required",
      });
    }

    // 🔍 Find auditor using username
    const auditor = await User.findOne({
      username,
      role: "auditor",
    });

    if (!auditor) {
      return res.status(404).json({
        message: "Auditor not found",
      });
    }

    // 🔍 Find application
    const application = await Certification.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // ✅ Assign auditor
    application.assignedAuditor = auditor._id;
    application.status = "Auditor Assigned";

    await application.save();

    res.json({
      message: "Auditor assigned successfully",
    });

  } catch (error) {
    console.error("Assign auditor error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};