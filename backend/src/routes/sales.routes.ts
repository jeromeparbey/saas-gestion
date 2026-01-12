import { Router } from "express";
import { SaleController } from "../controllers/sales.controller";

const router = Router();

router.get("/", SaleController.getSales);
router.post("/", SaleController.createSale);

export default router;
