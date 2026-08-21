-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'United States',
    "region" TEXT,
    "city" TEXT,
    "deviceType" TEXT NOT NULL DEFAULT 'Desktop',
    "browser" TEXT NOT NULL DEFAULT 'Chrome',
    "os" TEXT NOT NULL DEFAULT 'macOS',
    "referrer" TEXT NOT NULL DEFAULT 'Direct Traffic',
    "userAgent" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMetric" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "linkId" TEXT,
    "date" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryMetric" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL DEFAULT '🇺🇸',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceMetric" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrowserMetric" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrowserMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferrerMetric" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferrerMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClickEvent_workspaceId_timestamp_idx" ON "ClickEvent"("workspaceId", "timestamp");

-- CreateIndex
CREATE INDEX "ClickEvent_linkId_timestamp_idx" ON "ClickEvent"("linkId", "timestamp");

-- CreateIndex
CREATE INDEX "ClickEvent_timestamp_idx" ON "ClickEvent"("timestamp");

-- CreateIndex
CREATE INDEX "DailyMetric_workspaceId_date_idx" ON "DailyMetric"("workspaceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMetric_workspaceId_date_linkId_key" ON "DailyMetric"("workspaceId", "date", "linkId");

-- CreateIndex
CREATE INDEX "CountryMetric_workspaceId_idx" ON "CountryMetric"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "CountryMetric_workspaceId_country_key" ON "CountryMetric"("workspaceId", "country");

-- CreateIndex
CREATE INDEX "DeviceMetric_workspaceId_idx" ON "DeviceMetric"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceMetric_workspaceId_name_key" ON "DeviceMetric"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "BrowserMetric_workspaceId_idx" ON "BrowserMetric"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "BrowserMetric_workspaceId_name_key" ON "BrowserMetric"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "ReferrerMetric_workspaceId_idx" ON "ReferrerMetric"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerMetric_workspaceId_name_key" ON "ReferrerMetric"("workspaceId", "name");
