import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// 🚨 ERROR HANDLING (VERY IMPORTANT)
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