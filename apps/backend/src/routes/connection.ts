import { Router } from "express";
import { discordCallBack, notionCallback } from "../controllers/connections";

const router = Router();

router.get("/discord/callback", discordCallBack);
router.get("/notion/callback", notionCallback);

export default router;
