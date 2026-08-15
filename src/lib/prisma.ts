import { PrismaClient } from "@prisma/client";

const defaultNeonUrl =
  "postgresql://neondb_owner:npg_QzI8Eh4xmtvZ@ep-noisy-wildflower-b2jclyv1-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || defaultNeonUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
