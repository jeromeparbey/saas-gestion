import prisma from "../prisma/client";

export const SaleService = {
  // Récupérer toutes les ventes
  async getAllSales() {
    return prisma.sale.findMany({
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
  async createSale(data: {
    tenantId: string;
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return prisma.sale.create({
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
  async getSaleById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        tenant: true,
        user: true,
        items: { include: { product: true } },
      },
    });
  },
};
