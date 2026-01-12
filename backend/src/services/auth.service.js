"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.generate2FA = exports.login = exports.register = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// =====================
// REGISTER
// =====================
const register = async (email, password, role, tenantId) => {
    const existing = await client_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw new Error("Email déjà utilisé");
    const hashed = await bcrypt_1.default.hash(password, 10);
    return client_1.default.user.create({
        data: {
            email,
            password: hashed,
            role,
            tenantId: role === "SUPERADMIN" ? null : tenantId,
        },
    });
};
exports.register = register;
// =====================
// LOGIN + 2FA
// =====================
const login = async (email, password) => {
    const user = await client_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Utilisateur introuvable");
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        throw new Error("Mot de passe incorrect");
    const needs2FA = (user.role === "SUPERADMIN" || user.role === "DIRECTEUR") &&
        user.is2FAEnabled;
    //  JWT TEMPORAIRE
    const tempToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, tenantId: user.tenantId, is2FA: false }, JWT_SECRET, { expiresIn: "10m" });
    if (needs2FA) {
        return { requires2FA: true, tempToken };
    }
    // JWT FINAL
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: "8h" });
    return { token, requires2FA: false };
};
exports.login = login;
// GENERATE 2FA
const generate2FA = async (userId) => {
    const secret = speakeasy_1.default.generateSecret({
        name: "SaaS Gestion Pro",
    });
    await client_1.default.user.update({
        where: { id: userId },
        data: { twoFASecret: secret.base32 },
    });
    return {
        qrCode: await qrcode_1.default.toDataURL(secret.otpauth_url),
    };
};
exports.generate2FA = generate2FA;
// VERIFY 2FA
const verify2FA = async (userId, code) => {
    const user = await client_1.default.user.findUnique({ where: { id: userId } });
    if (!user?.twoFASecret)
        throw new Error("2FA non configurée");
    const valid = speakeasy_1.default.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token: code,
        window: 1,
    });
    if (!valid)
        throw new Error("Code 2FA invalide");
    await client_1.default.user.update({
        where: { id: userId },
        data: { is2FAEnabled: true },
    });
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: "8h" });
};
exports.verify2FA = verify2FA;
