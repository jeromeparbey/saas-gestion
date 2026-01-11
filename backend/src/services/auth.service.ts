import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterProps {
  email: string;
  password: string;
  role: string;
  tenantId?: string;
}

interface LoginProps {
  email: string;
  password: string;
}

// REGISTER

export const register = async ({ email, password, role, tenantId }: RegisterProps) => {
  // Vérifier si l'utilisateur existe
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email déjà utilisé");

  // Hasher le mot de passe
  const hashed = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role,
      tenantId: role === "SUPERADMIN" ? null : tenantId,
    },
  });

  return { id: user.id, email: user.email, role: user.role };
};

// =====================
// LOGIN
// =====================
export const login = async ({ email, password }: LoginProps) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Utilisateur introuvable");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Mot de passe incorrect");

  // JWT
  const payload = { id: user.id, role: user.role, tenantId: user.tenantId };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "8h" });

  // Gestion 2FA
  const is2FARequired = user.role === "SUPERADMIN" || user.role === "DIRECTEUR" ? !user.is2FAEnabled : false;

  return { token, user: { id: user.id, email: user.email, role: user.role }, is2FARequired };
};
