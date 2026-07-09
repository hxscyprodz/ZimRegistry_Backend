import {
  createStaff,
  getAllStaff,
  getStaff,
  updateStaff,
  updateStaffStatus,
  deleteStaff,
} from "../../controllers/dashboard/staff.controller";
import { Router } from "express";

const router = Router();

router.post("/", createStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaff);
router.put("/:id", updateStaff);
router.patch("/:id/active", updateStaffStatus);
router.delete("/:id", deleteStaff);

export default router;
