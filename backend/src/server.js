import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import seedAdmin from "./utils/seedAdmin.js";
import adminRoutes from "./routes/adminRoutes.js";
import auditorRoutes from "./routes/auditorRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";

// Load .env from parent folder
dotenv.config({ path: path.resolve("../.env") });

const app = express();

// ✅ CORS: allow frontend on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));



// Body parser
app.use(express.json());

// Connect MongoDB
connectDB();
seedAdmin();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auditor", auditorRoutes);
app.use("/api/certification", certificationRoutes);


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
