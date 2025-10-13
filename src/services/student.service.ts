
import * as Opac from "../core";
import { getScrapingSession } from "../db/queries";
import { AppError } from "../errors/app_error";
import { CryptoService } from "../utils/crypto";

export async function getStudentProfileService(sessionId: string) {
  const session = await getScrapingSession(sessionId);
  if (!session) {
    throw new AppError("Session not found or expired", 401, "session");
  }
  
  const sessionData = CryptoService.decrypt(session.encryptedData);
  const user = await Opac.getUserInfo(sessionData);
  return user;
}


export async function getStudentLoansService(sessionId: string) {
  const session = await getScrapingSession(sessionId);
  if (!session) {
    throw new AppError("Session not found or expired", 401, "session");
  }
  
  const sessionData = CryptoService.decrypt(session.encryptedData);
  const loans = await Opac.getUserLoans(sessionData);
  return loans;
}

export async function getStudentHistoryService(sessionId: string) {
  const session = await getScrapingSession(sessionId);
  if (!session) {
    throw new AppError("Session not found or expired", 401, "session");
  }
  
  const sessionData = CryptoService.decrypt(session.encryptedData);
  const history = await Opac.getUserHistory(sessionData);
  return history;
}