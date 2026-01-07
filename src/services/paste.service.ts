import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { PasteVisibility } from "@prisma/client";

export type AuthUser = {
  id: string;
};

type CreatePasteInput = {
  title?: string;
  content: string;
  visibility?: PasteVisibility;
  expiresAt?: Date | null;
};

type UpdatePasteInput = Partial<CreatePasteInput>;

export class PasteService {
  static async getById(id: string, user?: AuthUser) {
    const paste = await prisma.paste.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
      },
    });
    if (!paste) throw new AppError("Paste not found", 404);
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      throw new AppError("Paste has expired", 410);
    }

    if (paste.visibility === "private") {
      if (!user || paste.userId !== user.id) {
        throw new AppError("You are not allowed to view this paste", 403);
      }
    }

    return paste;
  }
  static async create(data: CreatePasteInput, user?: AuthUser) {
    if (!data.content) {
      throw new AppError("Content is required", 400);
    }
    const paste = await prisma.paste.create({
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility ?? "public",
        expiresAt: data.expiresAt ?? null,
        userId: user?.id ,
      },
    });
    return paste;
  }
  static async getByUser(userId: string) {
    const pastes = await prisma.paste.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return pastes;
  }

  static async update(id: string, userId: string, data: UpdatePasteInput) {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });
    if (!paste) throw new AppError("Paste not found", 404);
    if (paste.userId !== userId) {
      throw new AppError("You are not allowed to update this paste", 403);
    }

    const updated = await prisma.paste.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility,
        expiresAt: data.expiresAt,
      },
    });
    return updated;
  }

  static async delete(id: string, userId: string) {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) throw new AppError("Paste not found", 404);
    if (paste.userId !== userId) {
      throw new AppError("You are not allowed to delete this paste", 403);
    }

    await prisma.paste.delete({
      where: { id },
    });
  }
}
