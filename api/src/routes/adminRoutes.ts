import { Router } from "express";
import { getAdmin } from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/admin", authMiddleware, getAdmin);

export default router;
