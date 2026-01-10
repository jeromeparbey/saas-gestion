import { Request, Response, NextFunction } from "express";

export const permit = (...allowedRoles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    next();
  };
};
