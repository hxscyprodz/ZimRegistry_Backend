import { Router } from "express";
import { birthApplication } from "../controllers/birth.controller";
import authenticationMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/application", birthApplication);

export default router;