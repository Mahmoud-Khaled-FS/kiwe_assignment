import { Encryption } from './encryption';

/**
 * Base64 encryption
 * this is not secure and not even encryption
 * but it is simple and easy to use and do the idea
 * @see https://en.wikipedia.org/wiki/Base64
 */
class Base64Encryption implements Encryption {
  encrypt(data: string): string {
    return Buffer.from(data).toString('base64');
  }
  decrypt(data: string): string {
    return Buffer.from(data, 'base64').toString();
  }
  name(): string {
    return 'base64';
  }
}

export default Base64Encryption;
