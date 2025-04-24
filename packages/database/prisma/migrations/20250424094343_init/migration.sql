-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalGoogleCredential" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "ChannelId" TEXT NOT NULL,
    "pageToken" TEXT,
    "folderId" TEXT,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalGoogleCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slack" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "slackAccessToken" TEXT NOT NULL,
    "authedUserId" TEXT NOT NULL,
    "authedUserToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Slack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notion" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    "workspaceName" TEXT NOT NULL,
    "workspaceIcon" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordWebhook" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DiscordWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "discordWebhookId" TEXT,
    "slackId" TEXT,
    "notionId" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Zap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "sortingOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "AvailableAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "AvaliableTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZapRun" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "ZapRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZapRunOutbox" (
    "id" TEXT NOT NULL,
    "zapRunId" TEXT NOT NULL,

    CONSTRAINT "ZapRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nodes" TEXT,
    "edges" TEXT,
    "description" TEXT NOT NULL,
    "discordTemplate" TEXT,
    "notionTemplate" TEXT,
    "slackTemplate" TEXT,
    "slackChannels" TEXT[],
    "slackAccessToken" TEXT,
    "NotionAccessToken" TEXT,
    "notionDbId" TEXT,
    "flowPath" TEXT,
    "cronPath" TEXT,
    "publish" BOOLEAN DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_accessToken_key" ON "LocalGoogleCredential"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_ChannelId_key" ON "LocalGoogleCredential"("ChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGoogleCredential_userId_key" ON "LocalGoogleCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_slackAccessToken_key" ON "Slack"("slackAccessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_authedUserToken_key" ON "Slack"("authedUserToken");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_accessToken_key" ON "Notion"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_workspaceId_key" ON "Notion"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_databaseId_key" ON "Notion"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_webhookId_key" ON "DiscordWebhook"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_url_key" ON "DiscordWebhook"("url");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_channelId_key" ON "DiscordWebhook"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_zapId_key" ON "Trigger"("zapId");

-- CreateIndex
CREATE UNIQUE INDEX "ZapRunOutbox_zapRunId_key" ON "ZapRunOutbox"("zapRunId");

-- AddForeignKey
ALTER TABLE "LocalGoogleCredential" ADD CONSTRAINT "LocalGoogleCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slack" ADD CONSTRAINT "Slack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notion" ADD CONSTRAINT "Notion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordWebhook" ADD CONSTRAINT "DiscordWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_discordWebhookId_fkey" FOREIGN KEY ("discordWebhookId") REFERENCES "DiscordWebhook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_slackId_fkey" FOREIGN KEY ("slackId") REFERENCES "Slack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_notionId_fkey" FOREIGN KEY ("notionId") REFERENCES "Notion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zap" ADD CONSTRAINT "Zap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvaliableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvailableAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapRun" ADD CONSTRAINT "ZapRun_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapRunOutbox" ADD CONSTRAINT "ZapRunOutbox_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
