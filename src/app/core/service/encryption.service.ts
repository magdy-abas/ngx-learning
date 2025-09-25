import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private readonly VIDEO_ENCRYPTION_KEY =
    'ar95ZqLTMkHUXBNj6qjP-dI4Fk6NHtWXDDgUknzCw-O9A7DsHLjWZzIbqEherP';

  private readonly VIDEO_ENCRYPTION_IV =
    'ItSSsudAXFSz2UVfORI4-dICms5cVBNNzrx9E7AZt-adKUG1cc30f7iEeG88Yv';

  decryptData(
    encryptedText: string,
    userId: number,
    chapterId: number,
    objectId: number,
    userName: string
  ): string {
    if (!encryptedText) return '';

    const secretKey = `${userId}-${chapterId}-${this.VIDEO_ENCRYPTION_KEY}-${objectId}-${userName}`;
    const secretIv = `${userId}-${chapterId}-${this.VIDEO_ENCRYPTION_IV}-${objectId}-${userName}`;

    const keyHex = CryptoJS.SHA256(secretKey)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 32);
    const ivHex = CryptoJS.SHA256(secretIv)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 16);

    const key = CryptoJS.enc.Utf8.parse(keyHex);
    const iv = CryptoJS.enc.Utf8.parse(ivHex);

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        console.error('Decryption failed: output is empty');
        return '';
      }
      console.log('Decrypted URL:', decrypted);

      return decrypted;
    } catch (error) {
      console.error('Error during decryption:', error);
      return '';
    }
  }
}
