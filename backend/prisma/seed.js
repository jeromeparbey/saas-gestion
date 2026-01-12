"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../src/prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log("🚀 Starting database seeding...");
    // SUPERADMIN
    const superadminPassword = await bcrypt_1.default.hash("SuperAdmin123!", 10);
    const superadmin = await client_1.default.user.create({
        data: {
            email: "superadmin@saas.com",
            password: superadminPassword,
            role: "SUPERADMIN",
        },
    });
    console.log(`Superadmin crée: ${superadmin.email}`);
    // TENANTS + DIRECTEURS
    const tenantsData = [
        { name: "Tenant Alpha", domain: "alpha.com" },
        { name: "Tenant Beta", domain: "beta.com" },
    ];
    for (const tenantInfo of tenantsData) {
        // Crée le tenant
        const tenant = await client_1.default.tenant.create({
            data: {
                name: tenantInfo.name,
                domain: tenantInfo.domain,
                subscriptionPlan: "BASIC",
            },
        });
        // Crée le directeur associé au tenant
        const directeurPassword = await bcrypt_1.default.hash("Directeur123!", 10);
        const directeur = await client_1.default.user.create({
            data: {
                email: `directeur@${tenantInfo.domain}`,
                password: directeurPassword,
                role: "DIRECTEUR",
                tenantId: tenant.id,
            },
        });
        console.log(`✅ Tenant & Directeur created: ${tenant.name} / ${directeur.email}`);
        // PRODUITS
        const products = [
            { name: "Produit A", price: 10.5, stock: 100 },
            { name: "Produit B", price: 25, stock: 50 },
            { name: "Produit C", price: 5.99, stock: 200 },
        ];
        for (const prod of products) {
            const product = await client_1.default.product.create({
                data: {
                    ...prod,
                    tenantId: tenant.id,
                },
            });
            console.log(`  Produit creer : ${product.name} pour ${tenant.name}`);
        }
    }
    console.log("terminer");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await client_1.default.$disconnect();
});
