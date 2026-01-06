"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../lib/jwt");
async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid token" });
        }
        const token = authHeader.split(" ")[1];
        const payload = await (0, jwt_1.verifyJwt)(token);
        if (!payload.sub || typeof payload.sub !== "string") {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.user = { id: payload.sub };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
