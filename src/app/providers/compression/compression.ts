import { Injectable } from '@angular/core';
import { gunzipSync } from 'zlib';

@Injectable()
export class CompressionProvider {

  extract<T>(compressedData: string): T {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson);
  }
}
