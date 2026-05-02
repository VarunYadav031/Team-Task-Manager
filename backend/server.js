import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

console.log("Mounted API routes: /api/auth, /api/projects, /api/tasks, /api/users, /api/ping");

// Serve static files from frontend build in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // For any other route (except API routes), serve index.html (SPA routing)
  // Catch-all route for SPA - must be after static middleware and API routes
  // Use regex route to avoid path-to-regexp issue with "*"
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  // test route for development
  app.get("/", (req, res) => {
    res.send("API Running 🚀");
  });
}

// error handling
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED PROMISE:", err);
});

// PORT
const PORT = process.env.PORT || 8000;

// DB + SERVER START
connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});