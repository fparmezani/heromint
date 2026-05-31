import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

interface GeneratedImageTokenPayload {
  collectibleId: string;
  imageUrl: string;
}

function getEncryptionKey() {
  const secret =
    process.env.PREVIEW_DELIVERY_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("PREVIEW_DELIVERY_SECRET or NEXTAUTH_SECRET must be configured");
  }

  return createHash("sha256").update(secret).digest();
}

export function createGeneratedImageToken(payload: GeneratedImageTokenPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

export function readGeneratedImageToken(token: string, collectibleId: string) {
  const tokenBuffer = Buffer.from(token, "base64url");
  const iv = tokenBuffer.subarray(0, 12);
  const authTag = tokenBuffer.subarray(12, 28);
  const encrypted = tokenBuffer.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);

  decipher.setAuthTag(authTag);

  const payload = JSON.parse(
    Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
  ) as GeneratedImageTokenPayload;

  if (payload.collectibleId !== collectibleId) {
    throw new Error("Generated image token does not match collectible");
  }

  return payload;
}
