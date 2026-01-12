"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permit = void 0;
const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
};
exports.permit = permit;
