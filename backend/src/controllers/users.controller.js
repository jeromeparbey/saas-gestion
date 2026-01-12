"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_service_1 = require("../services/users.service");
exports.UserController = {
    async getAll(req, res) {
        try {
            const users = await users_service_1.UserService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur récupération utilisateurs", error });
        }
    },
    async getById(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const user = await users_service_1.UserService.getUserById(id);
            if (!user)
                return res.status(404).json({ message: "Utilisateur introuvable" });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur récupération utilisateur", error });
        }
    },
    async create(req, res) {
        try {
            const user = await users_service_1.UserService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur création utilisateur", error });
        }
    },
    async update(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const user = await users_service_1.UserService.updateUser(id, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur mise à jour utilisateur", error });
        }
    },
    async delete(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await users_service_1.UserService.deleteUser(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Erreur suppression utilisateur", error });
        }
    },
};
