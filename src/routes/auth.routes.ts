import { Router } from "express";
import AuthControllers from "../controllers/auth.controller";

const router = Router();

router.get('/refresh', AuthControllers.refresh);

export default router;