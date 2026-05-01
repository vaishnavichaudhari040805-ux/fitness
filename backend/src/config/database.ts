import { PrismaClient } from "@prisma/client";
import { config } from "./env";

// ─── Prisma Client Singleton ───────────────────────────────────
// Prevents multiple instances during hot-reloading in development

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    log:
      config.isDev
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (config.isDev) {
  // ─── Cache instance on global object in dev to survive HMR ──
  global.__prisma = prisma;
}

// ─── Graceful shutdown ────────────────────────────────────────
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;