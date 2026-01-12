"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/prisma/client.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    // optionnel : logging
    log: ["query", "info", "warn", "error"],
});
exports.default = prisma;
