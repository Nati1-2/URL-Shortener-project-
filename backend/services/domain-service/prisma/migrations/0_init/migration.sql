-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL DEFAULT 'ws_main',
    "hostname" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sslStatus" TEXT NOT NULL DEFAULT 'provisioning',
    "isCustom" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_workspaceId_idx" ON "Domain"("workspaceId");

-- CreateIndex
CREATE INDEX "Domain_hostname_idx" ON "Domain"("hostname");
