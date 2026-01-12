import type { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken({ id: user._id.toString() }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Register error", error);
    res.status(500).json({ message: "Failed to register user." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    res.json({
      token: generateToken({ id: user._id.toString() }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Failed to login." });
  }
};

export const getProfile = async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error", error);
    res.status(500).json({ message: "Failed to load profile." });
  }
};

