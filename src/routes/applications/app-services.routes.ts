import { Router } from "express";
import {
  trackApplication,
  getApplications,
} from "../../controllers/applications/apps-services.controller";
import { authenticationMiddleware } from "../../middleware/authentication";

const router = Router();

router.get("/track/:trackingId", trackApplication);
router.get("/", authenticationMiddleware, getApplications);

export default router;
