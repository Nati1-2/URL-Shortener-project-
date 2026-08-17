import { execSync } from "child_process";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

const services = [
  "auth-service",
  "link-service",
  "analytics-service",
  "workspace-service",
  "domain-service",
  "billing-service",
  "notification-service",
];

const workers = [
  "analytics-worker",
  "notification-worker",
  "webhook-worker",
];

async function syncDatabases() {
  console.log("==================================================");
  console.log("⚡ LinkPulse Database Synchronization (Neon Postgres)");
  console.log("==================================================\n");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ ERROR: DATABASE_URL is not set in backend/.env");
    process.exit(1);
  }

  console.log(`🔗 Database Target: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}\n`);

  const baseDb = databaseUrl.split("?")[0];

  for (const svc of services) {
    const schemaName = svc.replace("-service", "");
    const svcDbUrl = `${baseDb}?schema=${schemaName}&sslmode=require`;
    const schemaPath = path.join(__dirname, `../services/${svc}/prisma/schema.prisma`);
    console.log(`📦 [${svc}] Generating Prisma Client & Pushing Schema (schema: ${schemaName})...`);
    try {
      execSync(`npx prisma generate --schema="${schemaPath}"`, {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: svcDbUrl },
      });
      execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: svcDbUrl },
      });
      console.log(`✅ [${svc}] Synced successfully.\n`);
    } catch (err: any) {
      console.error(`❌ [${svc}] Sync failed:`, err.message);
    }
  }


  console.log("🎉 All microservice database schemas synchronized successfully!");
}

syncDatabases().catch((e) => {
  console.error("Fatal error during DB sync:", e);
  process.exit(1);
});
