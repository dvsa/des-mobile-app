import { TestBed } from '@angular/core/testing';
import { gzipSync } from 'zlib';
import { CompressionProvider } from '../compression';

xdescribe('Compression Provider', () => {

  let compressionProvider: CompressionProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompressionProvider,
      ],
    });

    compressionProvider = TestBed.inject(CompressionProvider);
  });

  xdescribe('extract', () => {
    it('should correctly decompress unformatted data', () => {
      const compressedData = gzipSync(JSON.stringify({
        test: 'test',
        test2: 1,
        test3: 1,
        test4: 1,
      }))
        .toString('base64');
      const result = compressionProvider.extract<Object>(compressedData);
      expect(result)
        .toEqual({
          test: 'test',
          test2: 1,
          test3: 1,
          test4: 1,
        });
    });
  });
});
