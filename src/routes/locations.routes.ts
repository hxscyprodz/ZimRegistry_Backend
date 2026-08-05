import { Router } from "express";
import { getDistricts, getProvinces } from "../controllers/location.controller";

const router = Router();

router.get("/provinces", getProvinces);
router.get("/districts", getDistricts);

export default router;
