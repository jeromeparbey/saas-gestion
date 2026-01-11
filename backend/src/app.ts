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

  // On ne prend que les fichiers .ts ou .js
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const route = require(path.join(routesPath, file)).default;

    
    const routeName = "/" + file.replace(/\.(ts|js)$/, "");
    app.use(routeName, route);
    console.log(`Route chargée : ${routeName}`);
  }
});

export default app;
