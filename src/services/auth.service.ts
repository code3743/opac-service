import { authUser, getSessionId } from "../core";
import { createScrapingSession, deleteScrapingSession, getScrapingSession, updateSession} from "../db/queries";
import { AppError } from "../errors/app_error";
import { CryptoService } from "../utils/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken} from "../utils/jwt";

interface LoginInput {
  studentCode?: string;
  anonymous?: boolean;
}

export async function login({ studentCode, anonymous }: LoginInput) {
  const opacSessionId = await getSessionId();
  if (studentCode) {
    const auth = await authUser(studentCode, opacSessionId);
    if (!auth) throw new AppError("Invalid student code", 401, "auth");
  }

  const sessionId = await createScrapingSession(
    anonymous ?? false ? "anonymous" : "student",
    CryptoService.encrypt(opacSessionId),
    studentCode
  );

  const payload = {
    sid: sessionId,
    sub: anonymous ? undefined : `student:${studentCode}`,
    anon: anonymous ?? false,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(sessionId);

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60,
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const sessionId = await getSessionId();
  const session = await getScrapingSession(payload.sub || "");
  if (!session) {
    throw new AppError("Invalid session", 401, "auth");
  }
  if (session.studentCode) {
    const auth = await authUser(session.studentCode, sessionId);
    if (!auth) throw new AppError("Invalid student code", 401, "auth");
  }

  await updateSession(session.id, CryptoService.encrypt(sessionId));

  const accessToken = signAccessToken({
    sid: session.id,
    sub: session.studentCode ? `student:${session.studentCode}` : undefined,
    anon: session.studentCode == null,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60,
  };
}

export async function logout(sessionId: string) {
  const session = await getScrapingSession(sessionId);
  if (!session) {
    throw new AppError("Session not found or expired", 401, "session");
  }
  await deleteScrapingSession(session.id, session.studentCode);
}
