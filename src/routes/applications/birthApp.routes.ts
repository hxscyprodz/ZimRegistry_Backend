import { Router } from "express";
import { createApplication } from "../../controllers/applications/birthApp.controller";

const router = Router();

router.post("/apply", createApplication);

export default router;