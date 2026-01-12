import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticateAndIsolate } from "../middlewares/isolation.middleware";

const router = Router();

/**
 * 🔓 ROUTES PUBLIQUES (PAS DE JWT)
 */

// Enregistrement
router.post("/register", AuthController.register);

// Login
router.post("/login", AuthController.login);

/**
 * 🔐 ROUTES PROTÉGÉES (JWT + ISOLATION)
 */

// Setup 2FA → utilisateur déjà identifié
router.post(
  "/2fa/setup",
  authenticateAndIsolate,
  AuthController.setup2FA
);

// Vérification OTP
router.post(
  "/2fa/verify",
  authenticateAndIsolate,
  AuthController.verify2FA
);

export default router;
