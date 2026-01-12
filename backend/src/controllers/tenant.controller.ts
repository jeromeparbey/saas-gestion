import { Request, Response } from "express";
import { TenantService } from "../services/tenant.service";

export const TenantController = {
  async getTenants(req: Request, res: Response) {
    try {
      const tenants = await TenantService.getAllTenants();
      res.json(tenants);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des commerces" });
    }
  },

  async createTenant(req: Request, res: Response) {
    try {
      const { name, domain, subscriptionPlan } = req.body;
      if (!name || !domain || !subscriptionPlan) {
        return res.status(400).json({ message: "Données manquantes" });
      }

      const tenant = await TenantService.createTenant({ name, domain, subscriptionPlan });
      res.status(201).json(tenant);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la création du commerce" });
    }
  },
};
