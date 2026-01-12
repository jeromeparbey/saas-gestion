"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const products_service_1 = require("../services/products.service");
exports.ProductController = {
    async getAll(req, res) {
        try {
            const products = await products_service_1.ProductService.getAllProducts();
            res.json(products);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Impossible de récupérer les produits" });
        }
    },
    async updateStock(req, res) {
        try {
            const { stock } = req.body;
            const productId = req.params.id;
            // Vérification de sécurité
            if (!productId || Array.isArray(productId)) {
                return res.status(400).json({ error: "ID produit invalide" });
            }
            if (stock == null)
                return res.status(400).json({ error: "Stock manquant" });
            const updatedProduct = await products_service_1.ProductService.updateStock(productId, Number(stock));
            res.json(updatedProduct);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Impossible de mettre à jour le stock" });
        }
    },
};
