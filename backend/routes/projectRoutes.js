import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  assignTeam,
  getProjectTracking,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// ✅ FIXED ROUTE
router.put("/assign-team", protect, assignTeam);

// ✅ TRACKING
router.get("/tracking/:projectId", protect, getProjectTracking);

export default router;
