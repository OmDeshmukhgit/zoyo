import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant
} from "../controllers/restaurantController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, createRestaurant);
router.delete("/:id", protect, deleteRestaurant);

export default router;
