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

app.use(
  cors({
    origin: "*", // 🔥 Railway ke liye open rakho (baad me restrict kar sakte ho)
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ IMPORTANT: pehle server start karo
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ DB connect baad me karo
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));