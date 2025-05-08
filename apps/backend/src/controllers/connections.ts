import { Request, Response } from "express";

import axios from "axios";
import { prisma } from "@repo/database/prisma";
import { URLSearchParams } from "url";
import { Client as NotionClient } from "@notionhq/client";

export const discordCallBack = async (
  req: Request,
  res: Response
): Promise<any> => {
  const code = req.query.code as string;
  const userId = req.body.userId;

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

export const notionCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;
  const user = req.body.userId;

  if (!code) {
    res.status(400).json({ messge: "No code provided!" });
    return;
  }
  if (!user) {
    res.status(411).json({ message: "No user found!" });
    return;
  }

  try {
    const encoded = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_API_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_url: process.env.NOTION_REDIRECT_URL,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    const { access_token, workspace_name, workspace_icon, workspace_id } =
      response.data;
    if (!access_token) {
      return res.redirect(
        process.env.FRONTEND_URL || "http://localhost:3000/connections"
      );
    }
    const notion = new NotionClient({ auth: access_token });

    const databasePages = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
      sort: {
        direction: "ascending",
        timestamp: "last_edited_time",
      },
    });

    const databaseId = databasePages?.results?.length
      ? databasePages.results[0].id
      : "";

    const notionConnection = await prisma.notion.create({
      data: {
        accessToken: access_token,
        workspaceId: workspace_id,
        databaseId,
        workspace_name: workspace_name,
        workspace_icon: workspace_icon || "",
        userId: parseInt(user),
      },
    });
    const redirectUrl = new URL(
      process.env.FRONTEND_URL || "http://localhost:3000/connections"
    );
    redirectUrl.searchParams.append(
      "access_token",
      notionConnection.accessToken
    );
    redirectUrl.searchParams.append(
      "workspace_name",
      notionConnection.workspaceName
    );
    redirectUrl.searchParams.append(
      "workspace_icon",
      notionConnection.workspaceIcon
    );
    redirectUrl.searchParams.append(
      "workspace_id",
      notionConnection.workspaceId
    );
    redirectUrl.searchParams.append("database_id", notionConnection.databaseId);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Notion OAuth Error", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}` || "http://localhost:3000/connections"
    );
  }
};

export const slackCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const code = req.query.code as string;
  const user = req.body.userId;

  if (!user) {
    return res.status(401).json({ message: "No user found!" });
  }
  if (!code) {
    return res.redirect(
      `${process.env.FRONTEND_URL}` || "http://localhost:3000/connections"
    );
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        redirect_url: process.env.SLACK_REDIRECT_URL!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (!data.ok) {
      throw new Error(data.error || "Slack OAuth failed");
    }

    const { app_id, authed_user, access_token, bot_user_id, team } = data;

    const slackConnection = await prisma.slack.create({
      data: {
        appId: app_id,
        teamId: team.id,
        teamName: team.name,
        botUserId: bot_user_id,
        slackAccessToken: access_token,
        authedUserId: authed_user.id,
        authedUserToken: authed_user.access_token,
        userId: parseInt(user),
      },
    });

    const redirectUrl = new URL(
      process.env.FRONTEND_URL || "http://localhost:3000/connections"
    );
    redirectUrl.searchParams.append("app_id", slackConnection.appId);
    redirectUrl.searchParams.append("team_id", slackConnection.teamId);
    redirectUrl.searchParams.append("team_name", slackConnection.teamName);
    redirectUrl.searchParams.append("bot_user_id", slackConnection.botUserId);
    redirectUrl.searchParams.append(
      "authed_user_id",
      slackConnection.authedUserId
    );
    redirectUrl.searchParams.append(
      "authed_user_token",
      slackConnection.authedUserToken
    );
    redirectUrl.searchParams.append(
      "slack_access_token",
      slackConnection.slackAccessToken
    );

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Slack server Error" });
  }
};
