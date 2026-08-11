import { Router } from "express";
import { login, register, profile } from "../controllers/auth.controller";
import { authenticationMiddleware } from "../middleware/authentication";

const router = Router();

router.post("/login", login);
router.get("/profile", authenticationMiddleware, profile);
router.post("/register", register);

export default router;
