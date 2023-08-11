import { gunzipSync } from 'zlib';
import { Injectable } from '@angular/core';

@Injectable()
export class CompressionProvider {

  extract<T>(compressedData: string): T {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson);
  }
}
