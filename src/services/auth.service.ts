import { LoginInput, RegisterInput } from "../interfaces/auth.interface";
import { prisma } from "../lib/prisma";

import bcrypt from "bcrypt";
import { signJwt } from "../lib/jwt";
export class AuthService {
  static async register(data: RegisterInput) {
    const { username, email, password } = data;
    const existingUser = await prisma?.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma?.user.create({
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

    const token = await signJwt(user.id);
    return {
      user,
      token,
    };
  }

  static async login(data: LoginInput) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // 3️⃣ Issue JWT
    const token = await signJwt(user.id);
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

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    if (!user) throw new Error("User Not found");
    return user;
  }
}
