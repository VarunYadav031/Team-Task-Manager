import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// ✅ ROOT ROUTE (must)
app.get("/", (req, res) => {
  res.status(200).send("API Running 🚀");
});

// routes
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);

// 🔥 SERVER FIRST START
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔥 DB AFTER (non-blocking)
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));