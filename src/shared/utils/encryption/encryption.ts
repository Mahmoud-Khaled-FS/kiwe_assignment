export interface Encryption {
  encrypt(data: string, key?: string): string;
  encrypt(data: string, key: string): string;
  decrypt(data: string, key?: string): string;
  decrypt(data: string, key: string): string;
  name(): string;
}
