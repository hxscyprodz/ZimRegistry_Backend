import {
  createStation,
  getAllStations,
  getStation,
  updateStation,
  deleteStation,
} from "../../controllers/dashboard/station.controller";
import { Router } from "express";

const router = Router();

router.post("/", createStation);
router.get("/", getAllStations);
router.get("/:id", getStation);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

export default router;