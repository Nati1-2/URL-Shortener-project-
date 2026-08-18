import "dotenv/config";
import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string {
  const baseDbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkpulse";
  if (baseDbUrl.includes("schema=")) {
    return baseDbUrl;
  }
  const isSsl = baseDbUrl.includes("sslmode=require");
  const baseUrl = baseDbUrl.split("?")[0];
  return `${baseUrl}?schema=billing${isSsl ? "&sslmode=require" : ""}`;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});


