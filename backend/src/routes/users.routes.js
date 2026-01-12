"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.get("/", users_controller_1.UserController.getAll); // GET /users
router.get("/:id", users_controller_1.UserController.getById); // GET /users/:id
router.post("/", users_controller_1.UserController.create); // POST /users
router.put("/:id", users_controller_1.UserController.update); // PUT /users/:id
router.delete("/:id", users_controller_1.UserController.delete); // DELETE /users/:id
exports.default = router;
