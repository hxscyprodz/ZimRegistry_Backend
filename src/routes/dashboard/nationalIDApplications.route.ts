import {
    createApplication,
    getAllApplications,
    getApplication,
    approveApplication,
    rejectApplication
} from "../../controllers/nationalIDApplications.controller";
import { Router } from "express";

const router = Router();

router.post("/", createApplication);
router.get("/", getAllApplications);
router.get("/:applicationId", getApplication);
router.patch("/:applicationId/approve", approveApplication);
router.patch("/:applicationId/reject", rejectApplication);

export default router