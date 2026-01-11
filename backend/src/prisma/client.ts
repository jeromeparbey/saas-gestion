// src/prisma/client.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // optionnel : logging
  log: ["query", "info", "warn", "error"],
});

export default prisma;
