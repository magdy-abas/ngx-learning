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

    const key = CryptoJS.SHA256(secretKey)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 32);
    const iv = CryptoJS.SHA256(secretIv)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 16);

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedText,
        CryptoJS.enc.Utf8.parse(key),
        { iv: CryptoJS.enc.Utf8.parse(iv) }
      );

      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        console.error('Decryption failed: output is empty');
        return '';
      }

      return decrypted;
    } catch (error) {
      console.error(' error:', error);
      return '';
    }
  }
}
