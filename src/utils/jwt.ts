import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

const ACCESS_EXP = "15m";
const REFRESH_EXP = "7d"; 

export interface AccessTokenPayload extends JwtPayload {
  sub?: string;      
  sid: string;       
  anon?: boolean;  
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: ACCESS_EXP });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwt.secret) as AccessTokenPayload;
}

export function signRefreshToken(id: string): string {
  return jwt.sign({ sub: id, type: "refresh" }, env.jwt.secret, { expiresIn: REFRESH_EXP });
}

export function verifyRefreshToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;
  if (payload.type !== "refresh") throw new Error("Invalid refresh token");
  return payload;
}
