import { PasteVisibility } from "@prisma/client";
import { z } from "../lib/openapi";

export const pasteBaseSchema = {
  title: z.string().max(200).optional(),

  content: z
    .string()
    .min(1, "Content is required")
    .max(100_000, "Paste is too large"),

  visibility: z.enum(PasteVisibility).optional(),

  expiresAt: z.iso
    .datetime()
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v) : null)),
};

export const updatePasteSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid paste id"),
  }),
  body: z
    .object({
      title: pasteBaseSchema.title,
      content: pasteBaseSchema.content.optional(),
      visibility: pasteBaseSchema.visibility,
      expiresAt: pasteBaseSchema.expiresAt,
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided",
    ),
});

export const createPasteSchema = z.object({
  body: z.object(pasteBaseSchema),
});

export const getPasteSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid paste id"),
  }),
});

/**
 * List pastes by user
 */
export const getUserPastesSchema = z.object({
  params: z.object({
    userId: z.uuid("Invalid user id"),
  }),
});
