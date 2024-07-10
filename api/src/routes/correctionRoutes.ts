import { Router } from "express";
import {
  getCorrections,
  createCorrection,
  updateCorrection,
  deleteCorrection,
} from "../controllers/correctionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/corrections/:correctorId", getCorrections);
router.post("/corrections", createCorrection);
router.put("/corrections/:correctionId", updateCorrection);
router.delete("/corrections/:correctionId", deleteCorrection);

export default router;
