import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import userRoutes from "./routes/userRoutes.js";

// Load .env from parent folder
dotenv.config({ path: path.resolve("../.env") });

const app = express();

// ✅ CORS: allow frontend on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// Body parser
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
