import * as dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayloadWithId extends jwt.JwtPayload { id: string; }

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }
    let decoded: JwtPayloadWithId;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET ?? "fallback_secret_key") as JwtPayloadWithId;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (!decoded || typeof decoded !== "object" || !("id" in decoded) || typeof decoded.id !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    console.error("Auth error", err);
    res.status(401).json({ message: "Not authorized" });
  }
};