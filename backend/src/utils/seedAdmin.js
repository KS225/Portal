import User from "../models/User.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin seeded successfully");
    }
  } catch (error) {
    console.error("Admin seeding error:", error);
  }
};

export default seedAdmin;