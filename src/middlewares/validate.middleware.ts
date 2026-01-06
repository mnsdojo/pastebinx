import { NextFunction, Response, Request } from "express";
import { ZodType } from "zod";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
  };
