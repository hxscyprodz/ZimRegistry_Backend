import { Router } from "express";
import {
  login,
  logout,
  getProfile,
} from "../../controllers/dashboard/auth.controller";
import protectRoute from "../../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/profile", protectRoute, getProfile);
router.post("/logout", logout);

export default router;
