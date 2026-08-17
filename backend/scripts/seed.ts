import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: path.join(__dirname, "../.env") });

import { PrismaClient as AuthPrisma } from "../services/auth-service/node_modules/@prisma/client";
import { PrismaClient as LinkPrisma } from "../services/link-service/node_modules/@prisma/client";
import { PrismaClient as AnalyticsPrisma } from "../services/analytics-service/node_modules/@prisma/client";
import { PrismaClient as WorkspacePrisma } from "../services/workspace-service/node_modules/@prisma/client";
import { PrismaClient as DomainPrisma } from "../services/domain-service/node_modules/@prisma/client";
import { PrismaClient as BillingPrisma } from "../services/billing-service/node_modules/@prisma/client";
import { PrismaClient as NotificationPrisma } from "../services/notification-service/node_modules/@prisma/client";
import { hashPassword } from "../packages/common/src/password";

const baseDb = (process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkpulse?sslmode=disable").split("?")[0];

const authDb = new AuthPrisma({ datasources: { db: { url: `${baseDb}?schema=auth&sslmode=require` } } });
const linkDb = new LinkPrisma({ datasources: { db: { url: `${baseDb}?schema=link&sslmode=require` } } });
const analyticsDb = new AnalyticsPrisma({ datasources: { db: { url: `${baseDb}?schema=analytics&sslmode=require` } } });
const workspaceDb = new WorkspacePrisma({ datasources: { db: { url: `${baseDb}?schema=workspace&sslmode=require` } } });
const domainDb = new DomainPrisma({ datasources: { db: { url: `${baseDb}?schema=domain&sslmode=require` } } });
const billingDb = new BillingPrisma({ datasources: { db: { url: `${baseDb}?schema=billing&sslmode=require` } } });
const notificationDb = new NotificationPrisma({ datasources: { db: { url: `${baseDb}?schema=notification&sslmode=require` } } });


async function main() {
  console.log("==================================================");



  console.log("🌱 Seeding LinkPulse Platform Database (Neon PostgreSQL)...");
  console.log("==================================================\n");

  // 1. Seed Primary User
  const email = "alex.vance@acme.inc";
  const passwordHash = await hashPassword("Password123!");
  const user = await authDb.user.upsert({
    where: { email },
    update: { name: "Alex Vance", emailVerified: true, status: "ACTIVE" },
    create: {
      id: "usr_alex_vance",
      email,
      passwordHash,
      name: "Alex Vance",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "OWNER",
      emailVerified: true,
      status: "ACTIVE",
    },
  });
  console.log(`✅ User seeded: ${user.name} (${user.email})`);

  // 2. Seed Workspace
  const workspace = await workspaceDb.workspace.upsert({
    where: { slug: "acme" },
    update: { name: "Acme Inc." },
    create: {
      id: "ws_main",
      name: "Acme Inc.",
      slug: "acme",
      ownerId: user.id,
      plan: "pro",
    },
  });
  console.log(`✅ Workspace seeded: ${workspace.name} (id: ${workspace.id})`);

  // Workspace Member
  await workspaceDb.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatarUrl,
      role: "OWNER",
    },
  });

  // 3. Seed Custom Domains
  await domainDb.domain.upsert({
    where: { hostname: "go.linkpulse.io" },
    update: { status: "verified", sslStatus: "active" },
    create: {
      id: "dom_default_1",
      workspaceId: workspace.id,
      hostname: "go.linkpulse.io",
      status: "verified",
      sslStatus: "active",
      isCustom: true,
      isDefault: true,
    },
  });

  await domainDb.domain.upsert({
    where: { hostname: "ly.nk" },
    update: { status: "verified", sslStatus: "active" },
    create: {
      id: "dom_default_2",
      workspaceId: workspace.id,
      hostname: "ly.nk",
      status: "verified",
      sslStatus: "active",
      isCustom: false,
      isDefault: false,
    },
  });
  console.log(`✅ Domains seeded: go.linkpulse.io, ly.nk`);

  // 4. Seed Subscription
  await billingDb.subscription.upsert({
    where: { workspaceId: workspace.id },
    update: { status: "active", planId: "pro", planName: "Pro Growth Plan" },
    create: {
      workspaceId: workspace.id,
      planId: "pro",
      planName: "Pro Growth Plan",
      status: "active",
      monthlyClicksLimit: 50000,
      usedClicksCurrentPeriod: 14230,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✅ Subscription seeded: Pro Growth Plan`);

  // 5. Seed Core Links
  const sampleLinks = [
    {
      id: "lnk_1",
      title: "Product Launch 2026 Docs",
      originalUrl: "https://github.com/trending",
      shortCode: "launch2026",
      domain: "ly.nk",
      shortUrl: "ly.nk/launch2026",
      status: "active",
      clicks: 4230,
      tags: ["launch", "marketing", "product"],
      utmSource: "twitter",
      utmMedium: "social",
      utmCampaign: "launch2026",
    },
    {
      id: "lnk_2",
      title: "Summer Promo 50% Off Campaign",
      originalUrl: "https://store.acme.inc/summer-deals",
      shortCode: "summer-sale",
      domain: "ly.nk",
      shortUrl: "ly.nk/summer-sale",
      status: "active",
      clicks: 8910,
      tags: ["promo", "campaign", "deals"],
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "summer_sale",
    },
    {
      id: "lnk_3",
      title: "Q3 Financial Growth Summary",
      originalUrl: "https://acme.inc/investors/q3-summary",
      shortCode: "q3-report",
      domain: "ly.nk",
      shortUrl: "ly.nk/q3-report",
      status: "active",
      clicks: 1090,
      tags: ["investors", "growth"],
    },
    {
      id: "lnk_4",
      title: "Tech Podcast Episode 12",
      originalUrl: "https://spotify.com/episode/12",
      shortCode: "podcast-ep12",
      domain: "ly.nk",
      shortUrl: "ly.nk/podcast-ep12",
      status: "active",
      clicks: 2450,
      tags: ["media", "podcast"],
    },
  ];

  for (const l of sampleLinks) {
    await linkDb.link.upsert({
      where: { shortCode: l.shortCode },
      update: { clicks: l.clicks, title: l.title, originalUrl: l.originalUrl },
      create: {
        ...l,
        workspaceId: workspace.id,
        createdBy: user.id,
      },
    });
  }
  console.log(`✅ Seeded ${sampleLinks.length} active short links.`);

  // 6. Seed Realistic Click Events for Rich Real-Time Analytics
  const existingClicks = await analyticsDb.clickEvent.count({ where: { workspaceId: workspace.id } });
  if (existingClicks < 50) {
    console.log("📊 Generating rich historical click telemetry events...");
    const countries = [
      { name: "United States", weight: 42 },
      { name: "United Kingdom", weight: 18 },
      { name: "Germany", weight: 14 },
      { name: "Canada", weight: 9 },
      { name: "France", weight: 7 },
      { name: "Japan", weight: 6 },
      { name: "Australia", weight: 4 },
    ];
    const devices = ["Desktop", "Desktop", "Desktop", "Mobile", "Mobile", "Tablet"];
    const browsers = ["Chrome", "Chrome", "Chrome", "Safari", "Safari", "Firefox", "Edge"];
    const referrers = ["Google Search", "Google Search", "Twitter / X", "Direct Traffic", "LinkedIn", "YouTube"];

    const eventsToCreate: any[] = [];
    const now = new Date();

    for (let day = 0; day < 30; day++) {
      const clicksOnDay = 8 + Math.floor(Math.random() * 12);
      for (let c = 0; c < clicksOnDay; c++) {
        const d = new Date(now);
        d.setDate(d.getDate() - day);
        d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const rand = Math.random() * 100;
        let cumulative = 0;
        let selectedCountry = "United States";
        for (const country of countries) {
          cumulative += country.weight;
          if (rand <= cumulative) {
            selectedCountry = country.name;
            break;
          }
        }

        const link = sampleLinks[Math.floor(Math.random() * sampleLinks.length)];
        const ipHash = crypto.createHash("sha256").update(`ip_${Math.floor(Math.random() * 50)}`).digest("hex").substring(0, 16);

        eventsToCreate.push({
          linkId: link.id,
          workspaceId: workspace.id,
          shortCode: link.shortCode,
          ipHash,
          country: selectedCountry,
          deviceType: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: selectedCountry === "United States" ? "macOS" : "Windows",
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          timestamp: d,
        });
      }
    }

    await analyticsDb.clickEvent.createMany({
      data: eventsToCreate,
    });
    console.log(`✅ Seeded ${eventsToCreate.length} telemetry click events.`);
  }

  // 7. Seed In-App Notifications
  await notificationDb.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: user.id,
        title: "Welcome to LinkPulse!",
        message: "Your workspace is ready. Start shortening links and tracking real-time analytics.",
        type: "success",
      },
      {
        workspaceId: workspace.id,
        userId: user.id,
        title: "Traffic Surge Detected",
        message: "Short link 'summer-sale' received over 500 clicks in the last hour.",
        type: "info",
      },
      {
        workspaceId: workspace.id,
        userId: user.id,
        title: "Custom Domain Active",
        message: "SSL certificate for 'go.linkpulse.io' has been provisioned and is active.",
        type: "success",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeded in-app notifications.");

  console.log("\n🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await authDb.$disconnect();
    await linkDb.$disconnect();
    await analyticsDb.$disconnect();
    await workspaceDb.$disconnect();
    await domainDb.$disconnect();
    await billingDb.$disconnect();
    await notificationDb.$disconnect();
  });


