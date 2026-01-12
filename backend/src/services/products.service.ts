// src/services/product.service.ts
import prisma from "../prisma/client";

export const ProductService = {
  async getAllProducts() {
    return prisma.product.findMany({
      select: { id: true, name: true, stock: true, price: true },
      orderBy: { name: "asc" },
    });
  },

  async updateStock(productId: string, stock: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
  },

  async createProduct(data: { name: string; price: number; stock: number; tenantId: string }) {
    return prisma.product.create({ data });
  },
};
