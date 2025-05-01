import { Router } from "express";
import connectionRoutes from "./connection";
const router = Router();
router.use("/connections", connectionRoutes);

export default router;
