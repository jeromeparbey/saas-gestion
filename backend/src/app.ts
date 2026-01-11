import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Chargement dynamique des routes
const routesPath = path.join(__dirname, "routes"); // dossier routes

fs.readdirSync(routesPath).forEach((file) => {

    if (file.endsWith(".ts") || file.endsWith(".js")) {
    // Import dynamique
    const imported = require(path.join(routesPath, file));
    const route = imported.default || imported; 

    // Vérification que c'est bien un Router
    if (typeof route === "function") {
      const routeName = "/" + file.replace(/\.(ts|js)$/, "");
      app.use(routeName, route);
      console.log(`Route chargée : ${routeName}`);
    } else {
      console.error(`⚠️ Le fichier ${file} n'exporte pas un Router valide.`);
    }
  }
});

export default app;
