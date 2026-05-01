import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// 🔥 CORS (Railway + frontend access)
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ✅ root route (important)
app.get("/", (req, res) => {
  res.status(200).send("Backend is working 🚀");
});

// ✅ test route (debugging)
app.get("/test", (req, res) => {
  res.send("Test route working ✅");
});

// ✅ PORT (Railway uses process.env.PORT)
const PORT = process.env.PORT || 8000;

// ✅ server start (IMPORTANT: 0.0.0.0 binding)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ DB connect (after server start)
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));