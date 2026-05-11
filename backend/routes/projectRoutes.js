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

// Specific routes should come before dynamic routes
router.put("/assign-team", protect, assignTeam);
router.get("/tracking/:projectId", protect, getProjectTracking);

// Dynamic routes
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;