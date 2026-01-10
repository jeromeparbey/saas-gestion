import * as GeneratedPrisma from "../src/generated/prisma/client";

// Récupération de la "classe" générée par Prisma
const PrismaClientClass = GeneratedPrisma.PrismaClient;

// Instanciation 
// On cast en "any" pour contourner les signatures complexes du généré
const prisma = new (PrismaClientClass as any)();

export default prisma;
