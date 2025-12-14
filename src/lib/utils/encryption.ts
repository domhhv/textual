import 'server-only';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const SECRET = process.env.ENCRYPTION_SECRET;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12;

if (!SECRET) {
  throw new Error('ENCRYPTION_SECRET is required');
}

const KEY = Buffer.from(SECRET, 'hex');

if (KEY.length !== 32) {
  throw new Error('ENCRYPTION_SECRET must be 32 bytes hex (64 hex chars)');
}

export function encryptKey(plaintext: string) {
  if (plaintext === '') {
    return '';
  }

  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptKey(ciphertext: string) {
  if (ciphertext === '') {
    return '';
  }

  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid ciphertext format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
