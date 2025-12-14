import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const SECRET = process.env.ENCRYPTION_SECRET!;
const ALGORITHM = 'aes-256-gcm';

export function encryptKey(plaintext: string) {
  if (plaintext === '') {
    return '';
  }

  const iv = randomBytes(16);
  const key = Buffer.from(SECRET, 'hex');
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptKey(ciphertext: string) {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = Buffer.from(SECRET, 'hex');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
