"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
// src/services/product.service.ts
const client_1 = __importDefault(require("../prisma/client"));
exports.ProductService = {
    async getAllProducts() {
        return client_1.default.product.findMany({
            select: { id: true, name: true, stock: true, price: true },
            orderBy: { name: "asc" },
        });
    },
    async updateStock(productId, stock) {
        return client_1.default.product.update({
            where: { id: productId },
            data: { stock },
        });
    },
    async createProduct(data) {
        return client_1.default.product.create({ data });
    },
};
