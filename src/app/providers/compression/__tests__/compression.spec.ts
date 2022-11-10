import { TestBed } from '@angular/core/testing';
import { gzipSync } from 'zlib';
import { categoryBTestResultMock } from '@shared/mocks/cat-b-test-result.mock';
import { CompressionProvider } from '../compression';

describe('Compression Provider', () => {

  let compressionProvider: CompressionProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompressionProvider,
      ],
    });

    compressionProvider = TestBed.inject(CompressionProvider);
  });

  describe('extractTestResult', () => {
    it('should correctly decompress a cat b test result', () => {
      const compressedData = gzipSync(JSON.stringify(categoryBTestResultMock)).toString('base64');
      const result = compressionProvider.extractTestResult(compressedData);
      expect(result).toEqual(categoryBTestResultMock);
    });
  });
});
