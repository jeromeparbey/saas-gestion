// src/routes/product.routes.ts
import { Router } from "express";
import { ProductController } from "../controllers/products.controller";

const router = Router();

router.get("/", ProductController.getAll);
router.put("/:id", ProductController.updateStock);

export default router;
