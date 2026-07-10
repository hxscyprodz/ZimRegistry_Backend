import {
  getAllProvinces,
  getProvince,
} from "../../controllers/dashboard/province.controller";
import { Router } from "express";

const router = Router();

router.get("/", getAllProvinces);
router.get("/:id", getProvince);

export default router;