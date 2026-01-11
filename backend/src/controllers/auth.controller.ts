import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { Role } from "@prisma/client";

// REGISTER

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, tenantId } = req.body;

    // Validation minimale
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ error: "Rôle invalide" });
    }

    const user = await AuthService.register(
      email,
      password,
      role as Role,
      tenantId
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// LOGIN (AVEC 2FA)

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const result = await AuthService.login(email, password);

    /**
     * Si 2FA requise :
     * - frontend reçoit tempToken
     * - redirige vers écran OTP
     */
    if (result.requires2FA) {
      return res.status(200).json({
        requires2FA: true,
        tempToken: result.tempToken,
      });
    }

    /**
     * Sinon → accès direct
     */
    return res.status(200).json({
      requires2FA: false,
      token: result.token,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// SETUP 2FA (QR CODE)

export const setup2FA = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const qr = await AuthService.generate2FA(req.user.id);

    res.json({
      message: "Scanne le QR Code avec Google Authenticator",
      qrCode: qr.qrCode,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// VERIFY 2FA (OTP)
export const verify2FA = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { code } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    if (!code) {
      return res.status(400).json({ error: "Code 2FA requis" });
    }

    const token = await AuthService.verify2FA(req.user.id, code);

    res.json({
      message: "2FA validée avec succès",
      token,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
