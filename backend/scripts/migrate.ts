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

const command = process.argv[2] || "deploy"; // default to deploy (safe for CI and production)

async function runMigrations() {
  console.log("==================================================");
  console.log(`⚡ LinkPulse Prisma Migrations Runner: [${command.toUpperCase()}]`);
  console.log("==================================================\n");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ ERROR: DATABASE_URL is not set in backend/.env");
    process.exit(1);
  }

  console.log(`🔗 Database Target: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}\n`);

  const baseDb = databaseUrl.split("?")[0];
  const isSsl = databaseUrl.includes("sslmode=require");

  let failedCount = 0;

  for (const svc of services) {
    const schemaName = svc.replace("-service", "");
    const svcDbUrl = `${baseDb}?schema=${schemaName}${isSsl ? "&sslmode=require" : ""}`;
    const schemaPath = path.join(__dirname, `../services/${svc}/prisma/schema.prisma`);

    console.log(`📦 [${svc}] Running 'prisma migrate ${command}' (schema: ${schemaName})...`);
    try {
      if (command === "deploy") {
        execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
          stdio: "inherit",
          env: { ...process.env, DATABASE_URL: svcDbUrl },
        });
      } else if (command === "status") {
        execSync(`npx prisma migrate status --schema="${schemaPath}"`, {
          stdio: "inherit",
          env: { ...process.env, DATABASE_URL: svcDbUrl },
        });
      } else if (command === "dev") {
        execSync(`npx prisma migrate dev --schema="${schemaPath}"`, {
          stdio: "inherit",
          env: { ...process.env, DATABASE_URL: svcDbUrl },
        });
      } else {
        console.error(`Unknown migration command: ${command}`);
        process.exit(1);
      }
      console.log(`✅ [${svc}] Migration step successful.\n`);
    } catch (err: any) {
      console.error(`❌ [${svc}] Migration failed:`, err.message);
      failedCount++;
    }
  }

  if (failedCount > 0) {
    console.error(`\n⚠️ Finished with ${failedCount} migration failure(s).`);
    process.exit(1);
  } else {
    console.log("\n🎉 All microservice database migrations applied successfully!");
  }
}

runMigrations().catch((e) => {
  console.error("Fatal error during migrations execution:", e);
  process.exit(1);
});
