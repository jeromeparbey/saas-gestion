import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { Role } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET || "secret";

// =====================
// REGISTER
// =====================
export const register = async (
  email: string,
  password: string, 
 role: Role,
  tenantId?: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email déjà utilisé");

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashed,
      role,
      tenantId: role === "SUPERADMIN" ? null : tenantId,
    },
  });
};

// =====================
// LOGIN + 2FA
// =====================
export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Utilisateur introuvable");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Mot de passe incorrect");

  const needs2FA =
    (user.role === "SUPERADMIN" || user.role === "DIRECTEUR") &&
    user.is2FAEnabled;

  //  JWT TEMPORAIRE
  const tempToken = jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenantId, is2FA: false },
    JWT_SECRET,
    { expiresIn: "10m" }
  );

  if (needs2FA) {
    return { requires2FA: true, tempToken };
  }

  // JWT FINAL
  const token = jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenantId },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, requires2FA: false };
};

// GENERATE 2FA

export const generate2FA = async (userId: string) => {
  const secret = speakeasy.generateSecret({
    name: "SaaS Gestion Pro",
  });

  await prisma.user.update({
    where: { id: userId },
    data: { twoFASecret: secret.base32 },
  });

  return {
    qrCode: await QRCode.toDataURL(secret.otpauth_url!),
  };
};


// VERIFY 2FA

export const verify2FA = async (userId: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFASecret) throw new Error("2FA non configurée");

  const valid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!valid) throw new Error("Code 2FA invalide");

  await prisma.user.update({
    where: { id: userId },
    data: { is2FAEnabled: true },
  });

  return jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenantId },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
};