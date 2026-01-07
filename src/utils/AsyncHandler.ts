// utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  <TReq extends Request = Request, TRes extends Response = Response>(
    fn: (req: TReq, res: TRes, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as TReq, res as TRes, next)).catch(next);
  };
