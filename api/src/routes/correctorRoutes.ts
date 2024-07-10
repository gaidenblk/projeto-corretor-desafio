import { Router } from "express";
import {
  getCorrectors,
  getCorrectorById,
  createCorrector,
  updateCorrector,
  deleteCorrector,
} from "../controllers/correctorController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/correctors", getCorrectors);
router.get("/correctors/:correctorId", getCorrectorById);
router.post("/correctors", createCorrector);
router.put("/correctors/:correctorId", updateCorrector);
router.delete("/correctors/:correctorId", deleteCorrector);

export default router;
