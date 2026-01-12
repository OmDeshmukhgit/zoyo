import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);

export default router;

