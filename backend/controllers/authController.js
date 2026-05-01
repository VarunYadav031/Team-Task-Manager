import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const validateUserInput = ({ name, email, password, role }, allowAdminRole = false) => {
  if (!name || name.trim().length < 2) return "Name must be at least 2 characters";
  if (!email || !emailRegex.test(email)) return "Valid email is required";
  if (!password || password.length < 8) return "Password must be at least 8 characters";
  if (role && !["admin", "member"].includes(role)) return "Invalid role";
  if (!allowAdminRole && role === "admin") return "Admin role cannot be created from signup";
  return null;
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const error = validateUserInput({ name, email, password, role }, false);

    if (error) return res.status(400).json({ msg: error });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: "member",
    });

    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Valid email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({
      msg: "Password reset code generated. It expires in 15 minutes.",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) return res.status(400).json({ msg: "Reset code is required" });
    if (!password || password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Reset code is invalid or expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successfully. Please sign in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET PROFILE (NEW)
// CHANGE PASSWORD FROM LOGGED-IN ACCOUNT
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ msg: "Current password is required" });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ msg: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Current password is wrong" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
