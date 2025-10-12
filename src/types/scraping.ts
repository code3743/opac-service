export type ScrapingSessionType = "anonymous" | "student";

export interface ScrapingSession {
  id: string;
  type: ScrapingSessionType;
  studentCode?: string | null;
  encryptedData: string;
  createdAt: Date;
  lastUsedAt?: Date | null;
  expiresAt: Date;
}


export interface DecodedScrapingSession extends ScrapingSession {
  cookies: string[];
  sessionId?: string;
}
