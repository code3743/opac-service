import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app_error";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: err.type,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
    type: "internal",
  });
}
