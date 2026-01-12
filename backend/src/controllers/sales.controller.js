"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const sales_service_1 = require("../services/sales.service");
exports.SaleController = {
    async getSales(req, res) {
        try {
            const sales = await sales_service_1.SaleService.getAllSales();
            res.json(sales);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récupération des ventes" });
        }
    },
    async createSale(req, res) {
        try {
            const { tenantId, userId, items } = req.body;
            if (!tenantId || !userId || !items || !Array.isArray(items)) {
                return res.status(400).json({ message: "Données manquantes ou invalides" });
            }
            const sale = await sales_service_1.SaleService.createSale({ tenantId, userId, items });
            res.status(201).json(sale);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la création de la vente" });
        }
    },
};
