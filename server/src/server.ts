import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import restaurantRoutes from "./routes/restaurantRoutes";
import authRoutes from "./routes/authRoutes";
import type { Request, Response } from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// After middleware
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);


// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running 🚀");
});

console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zomato";
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
