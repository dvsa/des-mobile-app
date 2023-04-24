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
  describe('extractTestSlotResult', () => {
    it('should correctly decompress a test slot result', () => {
      const compressedData = gzipSync(JSON.stringify({
        vehicleTypeCode: 'test',
        vehicleSlotTypeCode: 1,
      })).toString('base64');
      const result = compressionProvider.extractTestSlotResult(compressedData);
      expect(result).toEqual({
        vehicleTypeCode: 'test',
        vehicleSlotTypeCode: 1,
      });
    });
  });
  describe('extractUnformatted', () => {
    it('should correctly decompress unformatted data', () => {
      const compressedData = gzipSync(JSON.stringify({
        test: 'test',
        test2: 1,
        test3: 1,
        test4: 1,
      })).toString('base64');
      const result = compressionProvider.extractUnformatted(compressedData);
      expect(result).toEqual({
        test: 'test',
        test2: 1,
        test3: 1,
        test4: 1,
      });
    });
  });
});
