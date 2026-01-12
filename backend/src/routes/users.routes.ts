import { Router } from "express";
import { UserController } from "../controllers/users.controller";

const router = Router();

router.get("/", UserController.getAll);       // GET /users
router.get("/:id", UserController.getById);   // GET /users/:id
router.post("/", UserController.create);      // POST /users
router.put("/:id", UserController.update);    // PUT /users/:id
router.delete("/:id", UserController.delete);// DELETE /users/:id

export default router;
