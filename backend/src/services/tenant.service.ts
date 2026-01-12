import prisma from "../prisma/client";

export const TenantService = {
  // Récupérer tous les tenants
  async getAllTenants() {
    return prisma.tenant.findMany({
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
  async createTenant(data: { name: string; domain: string; subscriptionPlan: string }) {
    return prisma.tenant.create({
      data: {
        name: data.name,
        domain: data.domain,
        subscriptionPlan: data.subscriptionPlan as any,
      },
    });
  },

  // Récupérer un tenant par ID
  async getTenantById(id: string) {
    return prisma.tenant.findUnique({
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
