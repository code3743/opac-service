
import { ScrapingSession, ScrapingSessionType } from "../types/scraping";
import { query } from "./index";
import { v4 as uuidv4 } from "uuid";

export async function createScrapingSession(
  type: ScrapingSessionType,
  encryptedData: string,
  studentCode?: string
) {
  const id = uuidv4();
  await query(
    `INSERT INTO scraping_sessions (id, type, student_code, encrypted_data, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + interval '1 hour')`,
    [id, type, studentCode || null, encryptedData]
  );
  return id;
}

export async function getScrapingSession(id: string): Promise<ScrapingSession | null> {
  const rows = await query(`SELECT * FROM scraping_sessions WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
  const id = uuidv4();
  await query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [id, userId, tokenHash, expiresAt]
  );
  return id;
}
