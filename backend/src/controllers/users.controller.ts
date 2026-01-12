import { Request, Response } from "express";
import { UserService } from "../services/users.service";

export const UserController = {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération utilisateurs", error });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.getUserById(id);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération utilisateur", error });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur création utilisateur", error });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await UserService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur mise à jour utilisateur", error });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erreur suppression utilisateur", error });
    }
  },
};
