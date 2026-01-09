import { NextFunction, Request, Response } from "express";
import { PasteService } from "../services/paste.service";
import { asyncHandler } from "../utils/AsyncHandler";

export class PasteController {
  static getPaste = asyncHandler(async (req: Request, res: Response) => {
    const paste = await PasteService.getById(req.params.id, req.user);
    res.json(paste);
  });

  static createPaste = asyncHandler(async (req: Request, res: Response) => {
    const paste = await PasteService.create(req.body, req.user);
    res.status(201).json(paste);
  });

  static getPublicPastes = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await PasteService.getPublicPastes(page, limit);
    res.json(result);
  });

  static getMyPastes = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const pastes = await PasteService.getByUser(req.user.id);
    res.json(pastes);
  });
  static updatePaste = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const updated = await PasteService.update(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json(updated);
  });

  static deletePaste = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    await PasteService.delete(req.params.id, req.user.id);
    res.status(204).send();
  });
}
