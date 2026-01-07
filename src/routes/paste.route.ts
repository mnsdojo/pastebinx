import { Router } from "express";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { PasteController } from "../controllers/paste.controller";

const router = Router();
router.post("/", optionalAuth, PasteController.createPaste);
router.get("/:id", optionalAuth, PasteController.getPaste);
router.get("/user/me", requireAuth, PasteController.getMyPastes);
router.put("/:id", requireAuth, PasteController.updatePaste);
router.delete("/:id", requireAuth, PasteController.deletePaste);
export default router;
