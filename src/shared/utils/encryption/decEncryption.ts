import * as crypto from 'crypto';
import { Encryption } from './encryption';
import AppError from '../appError';

/**
 * DES encryption
 * NOTE (MAHOUD) - Encryption key must be exactly 8 bytes (64 bits)
 * this algorithm is not secure and may broken in new node version
 * to create more secure encryption use AES or RSA but this not E2E encryption or 64 bits
 * @see https://en.wikipedia.org/wiki/DES
 * @see https://nodejs.org/api/crypto.html
 */
class Des64Encryption implements Encryption {
  encrypt(data: string, key: string): string {
    this.validateKey(key);
    const keyBuffer = Buffer.from(key, 'utf-8');
    const cipher = crypto.createCipheriv(this.name(), keyBuffer, Buffer.alloc(8));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  decrypt(data: string, key: string): string {
    this.validateKey(key);
    const decipher = crypto.createDecipheriv(this.name(), key, Buffer.alloc(8));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  name(): string {
    return 'des-cbc';
  }

  private validateKey(key?: string): void {
    if (!key || key.length !== 8) {
      throw new AppError('Key must be exactly 8 bytes (64 bits) for DES encryption. header x-encryption-key');
    }
  }
}

export default Des64Encryption;
