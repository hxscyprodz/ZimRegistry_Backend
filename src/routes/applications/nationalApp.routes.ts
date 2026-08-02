import { createApplication } from "../../controllers/applications/nationalApp.controller";
import { Router } from "express";

const router = Router();

router.post("/apply", createApplication);

export default router;
