import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client"; // ton client Prisma
export const authenticateAndIsolate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};