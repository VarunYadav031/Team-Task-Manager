import User from "../models/User.js";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const validateUserInput = ({ name, email, password, role }) => {
  if (!name || name.trim().length < 2) return "Name must be at least 2 characters";
  if (!email || !emailRegex.test(email)) return "Valid email is required";
  if (!password || password.length < 8) return "Password must be at least 8 characters";
  if (!["admin", "member"].includes(role)) return "Role must be admin or member";
  return null;
};

// Admin: get all users
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const users = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: create a valid user only
export const createUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, password, role = "member" } = req.body;
    const error = validateUserInput({ name, email, password, role });

    if (error) return res.status(400).json({ msg: error });

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) return res.status(400).json({ msg: "User exists" });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role,
    });

    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update safe user fields
export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) {
      if (name.trim().length < 2) return res.status(400).json({ msg: "Name must be at least 2 characters" });
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!emailRegex.test(email)) return res.status(400).json({ msg: "Valid email is required" });
      const normalizedEmail = email.trim().toLowerCase();
      const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ msg: "Email already used" });
      user.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!["admin", "member"].includes(role)) return res.status(400).json({ msg: "Role must be admin or member" });
      user.role = role;
    }

    await user.save();

    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete user
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ msg: "You cannot delete your own admin account" });
    }

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
