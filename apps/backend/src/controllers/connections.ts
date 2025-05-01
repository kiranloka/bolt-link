import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "@repo/database/prisma";
import { URLSearchParams } from "url";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const discordCallBack = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const code = req.query.code as string;
  const userId = req.user?.userId;

  if (!code) {
    return res.status(400).json({ message: "No code provided!" });
  }
  if (!userId) {
    return res.status(411).json({ message: "user not found!" });
  }

  try {
    const data = new URLSearchParams();
    data.append("client_id", process.env.DISCORD_CLIENT_ID!);
    data.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
    data.append("grant_type", "authorization_code");
    data.append("redirect_url", process.env.DISCORD_REDIRECT_URL!);
    data.append("code", code);

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token, webhook } = tokenResponse.data;
    if (!access_token || !webhook) {
      return res.redirect("http://localhost:3000/connections");
    }

    const guildResponse = await axios.post(
      "https://discord.com/api/user/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const userGuild = await guildResponse.data.find(
      (guild: any) => guild.id === webhook.guild_id
    );
    if (!userGuild) {
      return res.redirect("http://localhost:3000/connections");
    }

    const discordWebhook = await prisma.discordWebhook.create({
      data: {
        webhookId: webhook.id,
        url: webhook.url,
        name: webhook.name,
        guildId: webhook.guild_id,
        channelId: webhook.channel_id,
        guildName: userGuild.name,
        userId: parseInt(userId),
      },
    });
    const redirectUrl = new URL("http://localhost:3000/conections");
    redirectUrl.searchParams.append("wehook_id", discordWebhook.webhookId);
    redirectUrl.searchParams.append("webhook_name", discordWebhook.name);
    redirectUrl.searchParams.append("webhook_url", discordWebhook.url);
    redirectUrl.searchParams.append("guild_name", discordWebhook.guildName);
    redirectUrl.searchParams.append("guild_id", discordWebhook.guildId);
    redirectUrl.searchParams.append("channel_Id", discordWebhook.channelId);

    return res.redirect(redirectUrl.toString());
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal server error!" });
  }
};
