"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../lib/jwt");
class AuthService {
    static async register(data) {
        const { username, email, password } = data;
        const existingUser = await prisma_1.prisma?.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await prisma_1.prisma?.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        const token = await (0, jwt_1.signJwt)(user.id);
        return {
            user,
            token,
        };
    }
    static async login(data) {
        const { email, password } = data;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Invalid email or password");
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // 3️⃣ Issue JWT
        const token = await (0, jwt_1.signJwt)(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    static async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new Error("User Not found");
        return user;
    }
}
exports.AuthService = AuthService;
