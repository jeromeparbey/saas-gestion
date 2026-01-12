"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("../controllers/sales.controller");
const router = (0, express_1.Router)();
router.get("/", sales_controller_1.SaleController.getSales);
router.post("/", sales_controller_1.SaleController.createSale);
exports.default = router;
