// src/controllers/product.controller.ts
import { Request, Response } from "express";
import { ProductService } from "../services/products.service";

export const ProductController = {
  async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Impossible de récupérer les produits" });
    }
  },

  async updateStock(req: Request, res: Response) {
    try {
      const { stock } = req.body;
      const productId = req.params.id;

      // Vérification de sécurité
      if (!productId || Array.isArray(productId)) {
        return res.status(400).json({ error: "ID produit invalide" });
      }

      if (stock == null) return res.status(400).json({ error: "Stock manquant" });

      const updatedProduct = await ProductService.updateStock(productId, Number(stock));
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Impossible de mettre à jour le stock" });
    }
  },
};
