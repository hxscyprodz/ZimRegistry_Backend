import { Router } from "express";
import UserControllers from "../controllers/user.controller";
const router = Router();

router.post("/signup", UserControllers.createUser);

export default router;