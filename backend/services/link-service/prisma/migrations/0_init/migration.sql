-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL DEFAULT 'ws_main',
    "createdBy" TEXT NOT NULL DEFAULT 'usr_alex_vance',
    "title" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT 'ly.nk',
    "shortUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "passwordHash" TEXT,
    "expiresAt" TIMESTAMP(3),
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "qrFgColor" TEXT NOT NULL DEFAULT '#0f172a',
    "qrBgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortCode_key" ON "Link"("shortCode");

-- CreateIndex
CREATE INDEX "Link_workspaceId_idx" ON "Link"("workspaceId");

-- CreateIndex
CREATE INDEX "Link_shortCode_idx" ON "Link"("shortCode");

-- CreateIndex
CREATE INDEX "Link_domain_shortCode_idx" ON "Link"("domain", "shortCode");

-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");
