import { Injectable } from '@angular/core';
import pako from 'pako';

@Injectable()
export class CompressionProvider {
  private static readonly textDecoder = new TextDecoder();
  private static readonly textEncoder = new TextEncoder();

  extract<T>(compressedData: string): T {
    // decode base64 string to Uint8Array
    const binaryString = atob(compressedData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const unzippedJson = CompressionProvider.textDecoder.decode(pako.ungzip(bytes));

    return JSON.parse(unzippedJson);
  }

  compress<T>(data: T): string {
    const jsonString = JSON.stringify(data);

    const bytes = CompressionProvider.textEncoder.encode(jsonString);

    const gzippedData = pako.gzip(bytes);

    let binaryString = '';

    for (let i = 0; i < gzippedData.length; i++) {
      binaryString += String.fromCharCode(gzippedData[i]);
    }

    // encode as base64
    return btoa(binaryString);
  }
}
