import { TestBed } from '@angular/core/testing';
import { gzipSync } from 'zlib';
import { CompressionProvider } from '../compression';

describe('CompressionProvider', () => {
  let compressionProvider: CompressionProvider;
  const mockDataToGzip = {
    test: 'test',
    test2: 1,
    test3: 1,
    test4: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompressionProvider,
      ],
    });

    compressionProvider = TestBed.inject(CompressionProvider);
  });

  describe('extract', () => {
    it('should correctly decompress unformatted data', () => {
      const compressedData = gzipSync(JSON.stringify(mockDataToGzip))
        .toString('base64');
      const result = compressionProvider.extract<Object>(compressedData);
      expect(result)
        .toEqual(mockDataToGzip);
    });
  });
});
