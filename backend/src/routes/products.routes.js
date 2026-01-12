"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/product.routes.ts
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const router = (0, express_1.Router)();
router.get("/", products_controller_1.ProductController.getAll);
router.put("/:id", products_controller_1.ProductController.updateStock);
exports.default = router;
