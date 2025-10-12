import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

const PUBLIC_PATHS = ["/auth/login", "/auth/refresh"];

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    sid: string;
    isAnon: boolean;
  };
}

export function authenticateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {

  if (PUBLIC_PATHS.some(path => req.path.startsWith(path))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
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
    res.status(401).json({ error: "Invalid or expired token", message: err});
  }
}
