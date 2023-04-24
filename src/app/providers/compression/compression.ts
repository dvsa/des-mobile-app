import { Injectable } from '@angular/core';
import { gunzipSync } from 'zlib';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

@Injectable()
export class CompressionProvider {

  extractTestResult(compressedData: string): TestResultSchemasUnion {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson);
  }
  extractTestSlotResult(compressedData: string): TestSlot {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson) as TestSlot;
  }
  extractUnformatted(compressedData: string) {
    const gzippedBytes = Buffer.from(compressedData, 'base64');
    const unzippedJson = gunzipSync(gzippedBytes).toString();
    return JSON.parse(unzippedJson);
  }
}
