"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
exports.SaleService = {
    // Récupérer toutes les ventes
    async getAllSales() {
        return client_1.default.sale.findMany({
            include: {
                tenant: { select: { id: true, name: true } },
                user: { select: { id: true, email: true } },
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        product: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" }, // utiliser createdAt au lieu de date
        });
    },
    // Créer une vente
    async createSale(data) {
        const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return client_1.default.sale.create({
            data: {
                tenantId: data.tenantId,
                userId: data.userId,
                totalAmount,
                items: { create: data.items },
            },
            include: {
                items: { include: { product: true } },
                tenant: true,
                user: true,
            },
        });
    },
    // Récupérer une vente par ID
    async getSaleById(id) {
        return client_1.default.sale.findUnique({
            where: { id },
            include: {
                tenant: true,
                user: true,
                items: { include: { product: true } },
            },
        });
    },
};
