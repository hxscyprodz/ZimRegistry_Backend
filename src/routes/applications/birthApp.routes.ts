import { Router } from "express";
import {
  createApplication,
  getApplications,
  getApplication,
  approveApplication,
} from "../../controllers/applications/birthApp.controller";

const router = Router();

router.post("/apply", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplication);
router.patch("/:id/approve", approveApplication);

export default router;
