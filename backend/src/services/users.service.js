"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserService = {
    // 🔹 Récupérer tous les utilisateurs sauf SUPERADMIN et DIRECTEUR
    async getAllUsers() {
        return client_1.default.user.findMany({
            where: {
                role: {
                    notIn: ["SUPERADMIN", "DIRECTEUR"],
                },
            },
            select: {
                id: true,
                email: true,
                role: true,
                tenantId: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
    },
    // 🔹 Récupérer un utilisateur par ID
    async getUserById(id) {
        return client_1.default.user.findUnique({
            where: { id },
            include: { tenant: true },
        });
    },
    // 🔹 Créer un utilisateur
    async createUser(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return client_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
                tenantId: data.tenantId,
            },
        });
    },
    // 🔹 Mettre à jour un utilisateur
    async updateUser(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
        return client_1.default.user.update({
            where: { id },
            data: updateData,
        });
    },
    // 🔹 Supprimer un utilisateur
    async deleteUser(id) {
        return client_1.default.user.delete({
            where: { id },
        });
    },
};
