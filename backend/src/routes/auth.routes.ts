import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware"; // vérifie JWT

const router = Router();


// Enregistrement utilisateur

router.post("/register", AuthController.register);

// Login avec gestion 2FA
router.post("/login", AuthController.login);

// Setup 2FA → génère QR code, doit être authentifié
router.post("/2fa/setup", authenticate, AuthController.setup2FA);

// Vérification 2FA → vérifie OTP et retourne le JWT final
router.post("/2fa/verify", authenticate, AuthController.verify2FA);

export default router;