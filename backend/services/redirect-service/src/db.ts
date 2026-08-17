import { PrismaClient } from "../../link-service/node_modules/@prisma/client";

const baseDbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkpulse?sslmode=disable";
const dbUrl = baseDbUrl.includes("schema=") ? baseDbUrl : `${baseDbUrl.split("?")[0]}?schema=link&sslmode=require`;

export const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });


