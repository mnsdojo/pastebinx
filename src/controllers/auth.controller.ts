import { AuthRequest } from "../middlewares/auth.middleware";
import { AuthService } from "./../services/auth.service";

import { Request, Response } from "express";

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  }
  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  }
  static async profile(req: AuthRequest, res: Response) {
    const user = await AuthService.getProfile(req.user!.id);
    res.status(200).json(user);
  }
}
