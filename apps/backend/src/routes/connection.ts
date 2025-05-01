import { Router } from "express";
import { discordCallBack } from "../controllers/connections";

const router = Router();

router.get("/discord/callback", discordCallBack);

export default router;
