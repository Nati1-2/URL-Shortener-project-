import { PrismaClient as AuthPrisma } from "../services/auth-service/node_modules/@prisma/client";
import { hashPassword } from "../packages/common/src/password";

async function main() {
  console.log("🌱 Starting LinkPulse backend database seed...");

  console.log("✅ Seed completed successfully!");
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
