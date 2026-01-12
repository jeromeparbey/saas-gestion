import { Router } from "express";
import { TenantController } from "../controllers/tenant.controller";

const router = Router();

router.get("/tenant", TenantController.getTenants);
router.post("/tenant", TenantController.createTenant);

export default router;
