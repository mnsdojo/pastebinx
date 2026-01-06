"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jose_1 = require("jose");
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
async function signJwt(userId) {
    return await new jose_1.SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}
async function verifyJwt(token) {
    const { payload } = await (0, jose_1.jwtVerify)(token, secret);
    return payload;
}
