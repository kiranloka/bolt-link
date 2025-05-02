import { Router } from "express";
import {
  discordCallBack,
  notionCallback,
  slackCallback,
} from "../controllers/connections";

const router = Router();

router.get("/discord/callback", discordCallBack);
router.get("/notion/callback", notionCallback);
router.get("slack/callback", slackCallback);

export default router;
