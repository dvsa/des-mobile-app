import { gunzipSync } from 'zlib';

export class CompressionProviderMock {
  extract<T>(compressedData: string): T {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson);
  }

}
