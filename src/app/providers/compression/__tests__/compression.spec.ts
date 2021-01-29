import { TestBed } from '@angular/core/testing';
import { gzipSync } from 'zlib';
import { configureTestSuite } from 'ng-bullet';
import { categoryBTestResultMock } from '../../../shared/mocks/cat-b-test-result.mock';
import { CompressionProvider } from '../compression';

describe('Compression Provider', () => {

  let compressionProvider: CompressionProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        CompressionProvider,
      ],
    });
  });

  beforeEach(() => {
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
