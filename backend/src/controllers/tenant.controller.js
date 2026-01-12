"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const tenant_service_1 = require("../services/tenant.service");
exports.TenantController = {
    async getTenants(req, res) {
        try {
            const tenants = await tenant_service_1.TenantService.getAllTenants();
            res.json(tenants);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récupération des commerces" });
        }
    },
    async createTenant(req, res) {
        try {
            const { name, domain, subscriptionPlan } = req.body;
            if (!name || !domain || !subscriptionPlan) {
                return res.status(400).json({ message: "Données manquantes" });
            }
            const tenant = await tenant_service_1.TenantService.createTenant({ name, domain, subscriptionPlan });
            res.status(201).json(tenant);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la création du commerce" });
        }
    },
};
