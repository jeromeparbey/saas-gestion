"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
exports.TenantService = {
    // Récupérer tous les tenants
    async getAllTenants() {
        return client_1.default.tenant.findMany({
            select: {
                id: true,
                name: true,
                domain: true,
                subscriptionPlan: true,
            },
            orderBy: { name: "asc" },
        });
    },
    // Créer un nouveau tenant
    async createTenant(data) {
        return client_1.default.tenant.create({
            data: {
                name: data.name,
                domain: data.domain,
                subscriptionPlan: data.subscriptionPlan,
            },
        });
    },
    // Récupérer un tenant par ID
    async getTenantById(id) {
        return client_1.default.tenant.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                domain: true,
                subscriptionPlan: true,
            },
        });
    },
};
