import { Request, Response } from "express";
import { SaleService } from "../services/sales.service";

export const SaleController = {
  async getSales(req: Request, res: Response) {
    try {
      const sales = await SaleService.getAllSales();
      res.json(sales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des ventes" });
    }
  },

  async createSale(req: Request, res: Response) {
    try {
      const { tenantId, userId, items } = req.body;
      if (!tenantId || !userId || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Données manquantes ou invalides" });
      }

      const sale = await SaleService.createSale({ tenantId, userId, items });
      res.status(201).json(sale);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la création de la vente" });
    }
  },
};
