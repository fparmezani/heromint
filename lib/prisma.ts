import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma v7: pass DATABASE_URL as datasourceUrl in constructor
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
