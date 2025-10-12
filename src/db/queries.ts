
import { ScrapingSession, ScrapingSessionType } from "../types/scraping";
import { query } from "./index";
import { v4 as uuidv4 } from "uuid";

export async function createScrapingSession(
  type: ScrapingSessionType,
  encryptedData: string,
  studentCode: string | null | undefined
) {
  const id = uuidv4();
  await query(
    `INSERT INTO scraping_sessions (id, type, student_code, encrypted_data, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + interval '1 hour')`,
    [id, type, studentCode || null, encryptedData]
  );
  return id;
}

export async function updateSession(id: string, encryptedData: string) {
  await query(
    `UPDATE scraping_sessions SET encrypted_data = $1 WHERE id = $2`,
    [encryptedData, id]
  );
  await query(
    `UPDATE scraping_sessions SET expires_at = NOW() + interval '1 hour' WHERE id = $1`,
    [id]
  );
  await query(
    `UPDATE scraping_sessions SET last_used_at = NOW() WHERE id = $1`,
    [id]
  );
}

export async function deleteScrapingSession(id  : string, userId: string | null | undefined) {
  await query(`DELETE FROM scraping_sessions WHERE id = $1`, [id]);
  if (userId){
    await query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
  }
}

export async function getScrapingSession(id: string): Promise<ScrapingSession | null> {
  const rows = await query(`SELECT * FROM scraping_sessions WHERE id = $1`, [id]);
  
 return rows[0] == null ? null : {
    id: rows[0]?.id,
    type: rows[0]?.type,
    studentCode: rows[0]?.student_code,
    encryptedData: rows[0]?.encrypted_data,
    createdAt: rows[0]?.created_at,
    lastUsedAt: rows[0]?.last_used_at,
    expiresAt: rows[0]?.expires_at,
  };
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
