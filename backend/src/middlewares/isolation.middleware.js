"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAndIsolate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client")); // ton client Prisma
const authenticateAndIsolate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token manquant" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        const user = await client_1.default.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                tenantId: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "Utilisateur introuvable" });
        }
        // 🔒 Isolation
        if (user.role !== "SUPERADMIN" && !user.tenantId) {
            return res.status(403).json({ error: "Tenant non assigné" });
        }
        req.user = user;
        // ✅ FIX ICI
        req.tenantId = user.tenantId ?? undefined;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }
};
exports.authenticateAndIsolate = authenticateAndIsolate;
