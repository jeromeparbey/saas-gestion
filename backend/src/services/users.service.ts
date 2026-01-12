import prisma from "../prisma/client";
import bcrypt from "bcrypt";

export const UserService = {
  // 🔹 Récupérer tous les utilisateurs sauf SUPERADMIN et DIRECTEUR
  async getAllUsers() {
    return prisma.user.findMany({
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
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });
  },

  // 🔹 Créer un utilisateur
  async createUser(data: {
    email: string;
    password: string;
    role: "SUPERADMIN" | "DIRECTEUR" | "GERANT" | "VENDEUR" | "MAGASINIER";
    tenantId?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        tenantId: data.tenantId,
      },
    });
  },

  // 🔹 Mettre à jour un utilisateur
  async updateUser(
    id: string,
    data: Partial<{ email: string; password: string; role: string; tenantId?: string }>
  ) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  // 🔹 Supprimer un utilisateur
  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
