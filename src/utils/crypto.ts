import crypto from "crypto";
import { env } from "../config/env";

export class CryptoService {
  private static readonly ALGORITHM = "aes-256-ctr";
  private static readonly IV_LENGTH = 16;
  private static readonly KEY = Buffer.from(env.crypto.encryptionKey, "hex");

 
  static encrypt<T>(data: T): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv);

    const input = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = Buffer.concat([cipher.update(input, "utf8"), cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  
  static decrypt<T = any>(encrypted: string): T {
    const [ivHex, contentHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(contentHex, "hex");

    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    const output = decrypted.toString("utf8");


    try {
      return JSON.parse(output) as T;
    } catch {
      return output as unknown as T;
    }
  }
}
