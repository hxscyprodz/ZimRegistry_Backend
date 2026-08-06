import { Router } from "express";
import { trackApplication } from "../../controllers/applications/trackApp.controller";

const router = Router();

router.get("/:trackingId", trackApplication);

export default router;
