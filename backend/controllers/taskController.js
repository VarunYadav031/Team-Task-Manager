import Task from "../models/Task.js";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      project,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET TASKS (FIXED)
export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate({
          path: "project",
          populate: {
            path: "team",
            select: "name email",
          },
        })
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate({
          path: "project",
          populate: {
            path: "team",
            select: "name email",
          },
        })
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, dueDate, progress, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.user.role === "admin") {
      if (title !== undefined) task.title = title;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (project !== undefined) task.project = project;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    if (description !== undefined) task.description = description;

    if (progress !== undefined) {
      task.progress = progress;

      if (progress === 100) task.status = "done";
      else if (progress > 0) task.status = "in-progress";
      else task.status = "todo";
    }

    if (status) task.status = status;

    task.activityLog.push({
      user: req.user._id,
      action: `Updated to ${task.status} (${task.progress}%)`,
    });

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
