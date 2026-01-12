"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Chargement dynamique des routes
const routesPath = path_1.default.join(__dirname, "routes"); // dossier routes
fs_1.default.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
        // Import dynamique
        const imported = require(path_1.default.join(routesPath, file));
        const route = imported.default || imported;
        // Vérification que c'est bien un Router
        if (typeof route === "function") {
            const routeName = "/" + file.replace(/\.(ts|js)$/, "");
            app.use(routeName, route);
            console.log(`Route chargée : ${routeName}`);
        }
        else {
            console.error(`⚠️ Le fichier ${file} n'exporte pas un Router valide.`);
        }
    }
});
exports.default = app;
