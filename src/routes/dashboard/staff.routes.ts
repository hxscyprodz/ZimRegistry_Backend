import {
  getStaffMember,
  getStaffMembers,
  updateStaffMember,
  deleteStaffMember,
} from "../../controllers/dashboard/staff.controller";
import { Router } from "express";

const router = Router();

router.get("/", getStaffMembers);
router.get("/:id", getStaffMember);
router.put("/:id", updateStaffMember);
router.delete("/:id", deleteStaffMember);

export default router;
