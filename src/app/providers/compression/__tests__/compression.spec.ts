import { TestBed } from '@angular/core/testing';
import pako from 'pako';
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
      providers: [CompressionProvider],
    });

    compressionProvider = TestBed.inject(CompressionProvider);
  });

  describe('extract', () => {
    it('should correctly decompress unformatted data', () => {
      // Compress data using pako to create test input
      const jsonString = JSON.stringify(mockDataToGzip);
      const bytes = new TextEncoder().encode(jsonString);
      const gzippedData = pako.gzip(bytes);

      // Convert to base64 (same way the compress method does it)
      let binaryString = '';
      const len = gzippedData.length;
      for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(gzippedData[i]);
      }
      const compressedData = btoa(binaryString);

      const result = compressionProvider.extract<Object>(compressedData);
      expect(result).toEqual(mockDataToGzip);
    });
  });

  describe('compress', () => {
    it('should correctly compress data', () => {
      const compressedData = compressionProvider.compress(mockDataToGzip);

      // Verify it's a base64 string
      expect(typeof compressedData).toBe('string');
      expect(compressedData.length).toBeGreaterThan(0);

      // Verify we can decompress it back
      const result = compressionProvider.extract<Object>(compressedData);
      expect(result).toEqual(mockDataToGzip);
    });
  });

  describe('compress and extract round trip', () => {
    it('should correctly compress and decompress data', () => {
      const compressedData = compressionProvider.compress(mockDataToGzip);
      const result = compressionProvider.extract<Object>(compressedData);
      expect(result).toEqual(mockDataToGzip);
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        string: 'test',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 2, 3, 'four'],
        nested: {
          deep: {
            value: 'nested value',
          },
        },
      };

      const compressedData = compressionProvider.compress(complexData);
      const result = compressionProvider.extract<Object>(compressedData);
      expect(result).toEqual(complexData);
    });
  });
});
