"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.setup2FA = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
// REGISTER
const register = async (req, res) => {
    try {
        const { email, password, role, tenantId } = req.body;
        // Validation minimale
        if (!email || !password || !role) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }
        if (!Object.values(role).includes(role)) {
            return res.status(400).json({ error: "Rôle invalide" });
        }
        const user = await AuthService.register(email, password, role, tenantId);
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
// LOGIN (AVEC 2FA)
const login = async (req, res) => {
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
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.login = login;
// SETUP 2FA (QR CODE)
const setup2FA = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }
        const qr = await AuthService.generate2FA(req.user.id);
        res.json({
            message: "Scanne le QR Code avec Google Authenticator",
            qrCode: qr.qrCode,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.setup2FA = setup2FA;
// VERIFY 2FA (OTP)
const verify2FA = async (req, res) => {
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
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.verify2FA = verify2FA;
