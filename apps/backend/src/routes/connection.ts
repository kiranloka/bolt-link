import { Router } from "express";
import "@repo/types";
import {
  discordCallBack,
  notionCallback,
  slackCallback,
} from "../controllers/connections";
import { requireAuth } from "@clerk/express";
const router = Router();

router.get("/discord/callback", requireAuth(), discordCallBack);
router.get("/notion/callback", requireAuth(), notionCallback);
router.get("slack/callback", requireAuth(), slackCallback);

export default router;
