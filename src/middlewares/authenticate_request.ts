import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../errors/app_error";

const PUBLIC_PATHS = ["/auth/login", "/auth/refresh"];

export function authenticateRequest(req: Request, res: Response, next: NextFunction) {

  if (PUBLIC_PATHS.some(path => req.originalUrl.startsWith(path))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authorization header missing or malformed", 401, "auth");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub?.replace("student:", ""),
      sid: payload.sid,
      isAnon: payload.anon ?? false
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Invalid or expired token", 401, "auth");
  }
}
