import { PrismaClient } from "@prisma/client";

// !process.env.SKIP_ENV_VALIDATION && (await import("../env/server.mjs"));
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    // env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }
