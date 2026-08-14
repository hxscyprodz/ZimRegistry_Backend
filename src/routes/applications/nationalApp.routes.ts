import {
  createApplication,
  getApplications,
} from "../../controllers/applications/nationalApp.controller";
import { Router } from "express";

const router = Router();

router.post("/apply", createApplication);
router.get("/", getApplications);

export default router;
