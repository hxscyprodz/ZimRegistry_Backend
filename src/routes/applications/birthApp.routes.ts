import { Router } from "express";
import {
  createApplication,
  getApplications,
} from "../../controllers/applications/birthApp.controller";

const router = Router();

router.post("/apply", createApplication);
router.get("/", getApplications);

export default router;
