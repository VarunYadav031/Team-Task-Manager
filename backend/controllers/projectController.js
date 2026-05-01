import Project from "../models/Project.js";
import Task from "../models/Task.js";


// ✅ CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, theme } = req.body;

    const project = await Project.create({
      name,
      theme,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET PROJECTS
export const getProjects = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { team: req.user._id };

    const projects = await Project.find(query)
      .populate("team", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 🔥 ASSIGN TEAM (MAIN FUNCTION)
export const assignTeam = async (req, res) => {
  try {
    const { projectId, users } = req.body;

    if (!projectId || !users || users.length === 0) {
      return res.status(400).json({ message: "Project & Users required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ ADD USERS TO TEAM (no duplicates)
    const currentTeam = project.team.map((id) => id.toString());
    project.team = [...new Set([...currentTeam, ...users])];

    await project.save();

    res.json({ message: "Team assigned successfully ✅", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ PROJECT TRACKING
export const getProjectTracking = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId }).populate(
      "assignedTo",
      "name"
    );

    if (tasks.length === 0) {
      return res.json({ progress: 0, users: [] });
    }

    // overall progress
    const total = tasks.reduce((sum, t) => sum + t.progress, 0);
    const progress = Math.round(total / tasks.length);

    // user-wise progress
    const userMap = {};

    tasks.forEach((t) => {
      if (!t.assignedTo) return;

      const uid = t.assignedTo._id.toString();

      if (!userMap[uid]) {
        userMap[uid] = {
          name: t.assignedTo.name,
          total: 0,
          count: 0,
        };
      }

      userMap[uid].total += t.progress;
      userMap[uid].count += 1;
    });

    const users = Object.values(userMap).map((u) => ({
      name: u.name,
      progress: Math.round(u.total / u.count),
    }));

    res.json({ progress, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, theme } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (name !== undefined) project.name = name;
    if (theme !== undefined) project.theme = theme;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("team", "name email role")
      .populate("createdBy", "name email");

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
