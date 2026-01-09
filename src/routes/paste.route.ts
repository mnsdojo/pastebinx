import { Router } from "express";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { PasteController } from "../controllers/paste.controller";
import { validate } from "../middlewares/validate.middleware";
import { createPasteSchema, getPasteSchema, updatePasteSchema } from "../schemas/paste.schema";

const router = Router();

router.get("/public", PasteController.getPublicPastes);
router.get("/me", requireAuth, PasteController.getMyPastes);

router.post(
  "/",
  validate(createPasteSchema),
  optionalAuth,
  PasteController.createPaste
);

router.get(
  "/:id",
  validate(getPasteSchema),
  optionalAuth,
  PasteController.getPaste
);

router.put(
  "/:id",
  validate(updatePasteSchema),
  requireAuth,
  PasteController.updatePaste
);

router.delete("/:id", requireAuth, PasteController.deletePaste);

export default router;
